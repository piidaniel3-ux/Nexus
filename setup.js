require('dotenv').config();
const bcrypt = require('bcryptjs');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const DB_PATH = './data/db.json';
const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));

db.users = db.users.filter(u => u.email !== 'piidaniel3@gmail.com');

const hash = bcrypt.hashSync('Daniel2025!', 10);
const allIds = db.formations.map(f => f.id);

db.users.push({
  id: uuidv4(),
  nom: 'Daniel',
  email: 'piidaniel3@gmail.com',
  password: hash,
  formations: allIds,
  role: 'owner',
  createdAt: new Date().toISOString()
});

fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));

console.log('\n✅ Compte owner créé !');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📧 Email    : piidaniel3@gmail.com');
console.log('🔑 Password : Daniel2025!');
console.log('🎓 Formations débloquées : ' + allIds.length);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('\nLance maintenant: npm start\n');
