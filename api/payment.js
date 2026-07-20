require('dotenv').config();
const express = require('express');
const https = require('https');
const { v4: uuidv4 } = require('uuid');
const { readDB, writeDB } = require('./db');
const auth = require('../middleware/auth');
const router = express.Router();

function getBase() {
  return process.env.PAYPAL_MODE === 'live' ? 'api-m.paypal.com' : 'api-m.sandbox.paypal.com';
}

async function getToken() {
  const creds = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
  return new Promise((resolve, reject) => {
    const body = 'grant_type=client_credentials';
    const req = https.request({
      hostname: getBase(), path: '/v1/oauth2/token', method: 'POST',
      headers: { 'Authorization': `Basic ${creds}`, 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': body.length }
    }, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d).access_token); } catch { reject(new Error('Token invalide')); } });
    });
    req.on('error', reject); req.write(body); req.end();
  });
}

async function ppReq(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const b = body ? JSON.stringify(body) : '';
    const req = https.request({
      hostname: getBase(), path, method,
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(b) }
    }, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch { reject(new Error('Erreur PayPal')); } });
    });
    req.on('error', reject); req.write(b); req.end();
  });
}

router.post('/create-order', auth, async (req, res) => {
  try {
    const { formation_id } = req.body;
    const db = readDB();
    const formation = db.formations.find(f => f.id === formation_id);
    if (!formation) return res.status(404).json({ error: 'Formation introuvable' });
    const user = db.users.find(u => u.id === req.user.id);
    if (user && user.formations.includes(formation_id))
      return res.status(409).json({ error: 'Formation déjà achetée' });
    const token = await getToken();
    const order = await ppReq('POST', '/v2/checkout/orders', {
      intent: 'CAPTURE',
      purchase_units: [{ description: formation.titre, amount: { currency_code: 'EUR', value: formation.prix.toFixed(2) } }],
      application_context: {
        brand_name: 'NEXUS Formations',
        return_url: `${req.protocol}://${req.get('host')}/dashboard?success=true`,
        cancel_url: `${req.protocol}://${req.get('host')}/formations`
      }
    }, token);
    const approveUrl = order.links?.find(l => l.rel === 'approve')?.href;
    res.json({ order_id: order.id, approve_url: approveUrl });
  } catch (e) {
    console.error('PAYMENT ERROR:', e.message);
    res.status(500).json({ error: e.message });
  }
});

router.post('/capture-order', auth, async (req, res) => {
  try {
    const { order_id, formation_id } = req.body;
    const token = await getToken();
    const result = await ppReq('POST', `/v2/checkout/orders/${order_id}/capture`, {}, token);
    if (result.status === 'COMPLETED') {
      const db = readDB();
      const idx = db.users.findIndex(u => u.id === req.user.id);
      if (idx !== -1 && !db.users[idx].formations.includes(formation_id)) {
        db.users[idx].formations.push(formation_id);
      }
      db.orders.push({ id: uuidv4(), user_id: req.user.id, formation_id, order_id, statut: 'completed', date: new Date().toISOString() });
      writeDB(db);
      res.json({ success: true });
    } else {
      res.status(400).json({ error: 'Paiement non complété' });
    }
  } catch (e) {
    console.error('CAPTURE ERROR:', e.message);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
