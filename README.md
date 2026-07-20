# NEXUS Formations — Site Complet

## Installation en 3 étapes

### 1. Installer les dépendances
```bash
npm install
```

### 2. Créer le compte owner
```bash
node setup.js
```
Email : piidaniel3@gmail.com
Password : Daniel2025!

### 3. Lancer le site
```bash
npm start
```
Ouvre : http://localhost:3000

---

## Configuration PayPal (pour recevoir de vrais paiements)

Dans `public/formations.html` ligne 8, remplace `VOTRE_PAYPAL_CLIENT_ID` par ton Client ID PayPal Live.

Dans `.env`, mets :
```
PAYPAL_CLIENT_ID=ton_vrai_client_id
PAYPAL_CLIENT_SECRET=ton_vrai_secret
PAYPAL_MODE=live
```

Récupère tes clés sur : https://developer.paypal.com → Apps & Credentials → Live

---

## Structure du projet
```
nexus-v3/
├── server.js          # Serveur Express
├── setup.js           # Crée le compte owner
├── .env               # Variables d'environnement
├── api/
│   ├── auth.js        # Inscription/Connexion
│   ├── formations.js  # Catalogue
│   ├── content.js     # Contenu des modules
│   ├── payment.js     # PayPal
│   └── db.js          # Lecture/écriture JSON
├── middleware/
│   └── auth.js        # Vérification JWT
├── data/
│   ├── db.json        # Base de données
│   └── content.json   # Contenu des 51 modules
└── public/
    ├── index.html     # Accueil
    ├── formations.html # Catalogue
    ├── login.html     # Connexion/Inscription
    ├── dashboard.html  # Espace membre
    ├── module.html    # Lecteur de module
    ├── css/global.css
    └── js/global.js
```

---

## Formations incluses (9 formations, 51 modules)

| Formation | Prix | Modules |
|-----------|------|---------|
| Marketing Digital Standard | 50€ | 5 |
| Marketing Digital Avancé | 75€ | 6 |
| Marketing Digital Premium | 100€ | 7 |
| E-commerce Standard | 50€ | 5 |
| E-commerce Premium | 100€ | 6 |
| Trading Standard | 50€ | 5 |
| Trading Premium | 100€ | 6 |
| OFM IA Standard | 50€ | 5 |
| OFM IA Premium | 100€ | 6 |
