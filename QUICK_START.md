# 🚀 Guide de Démarrage Rapide

## ⚡ Lancement en 3 étapes

### 1. **Backend (Terminal 1)**
```bash
cd backend
pip install flask flask-sqlalchemy flask-jwt-extended flask-cors flask-login flask-migrate python-dotenv
python app.py
```
✅ Backend disponible sur : `http://localhost:5009`

### 2. **Frontend (Terminal 2)**
```bash
cd frontend
npm install
npm run dev
```
✅ Frontend disponible sur : `http://localhost:5173`

### 3. **Accéder à l'application**
Ouvrez votre navigateur sur : `http://localhost:5173`

---

## 🛑 Arrêter l'application

Dans chaque terminal, appuyez sur :
```
Ctrl + C
```

---

## 🔧 Résolution rapide des problèmes

### Port déjà utilisé ?
```bash
# Trouver et tuer le processus
lsof -i :5009  # Backend
lsof -i :5173  # Frontend
kill -9 <PID>
```

### Erreur de modules ?
```bash
# Backend
cd backend && pip install flask flask-sqlalchemy flask-jwt-extended flask-cors flask-login

# Frontend
cd frontend && npm install
```

---

## 📱 Test rapide

1. **Inscription** : Créez un compte sur `http://localhost:5173`
2. **Publication** : Cliquez sur "Publier une œuvre"
3. **Exploration** : Allez dans "Explorer" pour voir les œuvres
4. **Profil** : Consultez "Mon espace" pour vos statistiques

---

**🎉 C'est parti ! Votre réseau littéraire est prêt !** 