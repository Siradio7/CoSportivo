# 🏟️ CoSportivo — Plateforme de covoiturage sportif

Bienvenue sur **CoSportivo**, une plateforme dédiée aux **supporters** et **sportifs** qui souhaitent se rendre ensemble aux événements sportifs en proposant ou en réservant des trajets. 🚗⚽

---

## 🔥 Exemple d’utilisation

- Un supporter va voir un match et propose des places dans sa voiture.
- D'autres utilisateurs peuvent réserver une place en temps réel.
- Un système de chat permet d'échanger avant le trajet.

---

## 🧩 Fonctionnalités principales

### 1️⃣ Gestion des trajets
- Création d’annonces avec lieu de départ, d’arrivée, heure et places disponibles.
- Affichage en temps réel des trajets proposés.
- Réservation d’une ou plusieurs places.

### 2️⃣ Mise à jour en temps réel
- Notifications en live pour les conducteurs et passagers à travers **Socket.IO**.

### 3️⃣ Système de chat
- Discussion instantanée entre conducteur et passagers avant le trajet.

### 4️⃣ Gestion des profils
- Informations personnelles (nom, équipe favorite…)
- Historique des trajets
- Système de notation

### 5️⃣ Gestion des événements sportifs
- Lien direct vers les trajets disponibles.

---

## ⚙️ Stack technique

### 🖥️ Frontend
- **React.js**
- **Tailwind CSS** (UI moderne et responsive)
- **Framer Motion** (Animations douces)
- **React Hook Form** (Gestions des formulaires)
- **React Hot Toast** (Notifications)

### 🛠️ Backend
- **Node.js** avec **Express**
- **Socket.IO** (mise à jour temps réel & chat)
- **MySQL** (base de données relationnelle)

---

## 🌐 API utilisée

- [football-data.org](http://football-data.org)

---

## 🧱 Liens utiles

- 🔗 [Modélisation BDD](https://www.notion.so/Mod-lisation-BDD-1c80936b62668049b44ce84682d78962?pvs=21)
- 📁 [Structure du projet](https://www.notion.so/Structure-du-projet-1c90936b6266805da9d5ed6b17afaeb3?pvs=21)

---

## 🚀 Lancement du projet

### 1. Cloner le repo
```bash
git clone https://github.com/Siradio7/cosportivo.git
cd cosportivo
```

### 2. Lancer le backend
```bash
cd backend
npm install
npm run dev
```

### 2. Lancer le frontend
```bash
cd client
npm install
npm run dev
```