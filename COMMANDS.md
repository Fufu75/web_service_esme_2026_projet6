# 📋 Commandes Utiles - Réseau Littéraire ESME

## 🚀 Démarrage et Arrêt

### **Méthode 1 : Scripts automatiques (Recommandé)**
```bash
# Démarrer l'application complète
./start.sh

# Arrêter l'application complète
./stop.sh
```

### **Méthode 2 : Manuel (2 terminaux)**
```bash
# Terminal 1 - Backend
cd backend && python app.py

# Terminal 2 - Frontend  
cd frontend && npm run dev

# Arrêt : Ctrl+C dans chaque terminal
```

---

## 🔧 Installation des dépendances

### **Backend (Python)**
```bash
cd backend
pip install -r requirements.txt
# ou
pip install flask flask-sqlalchemy flask-jwt-extended flask-cors flask-login flask-migrate python-dotenv
```

### **Frontend (Node.js)**
```bash
cd frontend
npm install
```

---

## 🐛 Résolution de problèmes

### **Ports occupés**
```bash
# Voir qui utilise les ports
lsof -i :5009  # Backend
lsof -i :5173  # Frontend

# Tuer un processus spécifique
kill -9 <PID>

# Tuer tous les processus sur un port
kill -9 $(lsof -ti:5009)  # Backend
kill -9 $(lsof -ti:5173)  # Frontend
```

### **Base de données corrompue**
```bash
cd backend
rm esme_litteraire.db
python app.py  # Recrée automatiquement
```

### **Cache npm corrompu**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### **Modules Python manquants**
```bash
cd backend
pip install --upgrade pip
pip install -r requirements.txt
```

---

## 🧪 Tests et Vérifications

### **Tester l'API Backend**
```bash
# Santé de l'API
curl http://localhost:5009/api/

# Test d'inscription
curl -X POST http://localhost:5009/api/register \
  -H "Content-Type: application/json" \
  -d '{"username": "test", "email": "test@example.com", "password": "password123"}'

# Test de connexion
curl -X POST http://localhost:5009/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

### **Vérifier les services**
```bash
# Vérifier que les ports sont ouverts
netstat -an | grep :5009  # Backend
netstat -an | grep :5173  # Frontend

# Vérifier les processus Python/Node
ps aux | grep python
ps aux | grep node
```

---

## 📊 Monitoring

### **Logs en temps réel**
```bash
# Logs backend (si lancé manuellement)
cd backend && python app.py

# Logs frontend (si lancé manuellement)  
cd frontend && npm run dev

# Logs système
tail -f /var/log/system.log  # macOS
```

### **Performance**
```bash
# Utilisation CPU/Mémoire
top -p $(pgrep -f "python app.py")
top -p $(pgrep -f "npm run dev")

# Espace disque
du -sh backend/ frontend/
```

---

## 🔄 Développement

### **Backend**
```bash
# Lancer en mode debug
cd backend
export FLASK_ENV=development
python app.py

# Migrations de base de données (si nécessaire)
flask db init
flask db migrate -m "Description"
flask db upgrade
```

### **Frontend**
```bash
# Mode développement
cd frontend && npm run dev

# Build de production
cd frontend && npm run build

# Prévisualiser le build
cd frontend && npm run preview

# Linter/Formatter
cd frontend && npm run lint
```

---

## 📦 Production

### **Build Frontend**
```bash
cd frontend
npm run build
# Les fichiers sont dans dist/
```

### **Variables d'environnement**
```bash
# Backend (.env)
FLASK_ENV=production
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///esme_litteraire.db

# Frontend (.env)
VITE_API_URL=http://localhost:5009
```

---

## 🆘 Commandes d'urgence

### **Reset complet**
```bash
# Arrêter tout
./stop.sh

# Nettoyer les caches
cd backend && rm -f esme_litteraire.db
cd frontend && rm -rf node_modules package-lock.json

# Réinstaller
cd backend && pip install -r requirements.txt
cd frontend && npm install

# Redémarrer
./start.sh
```

### **Diagnostic complet**
```bash
# Vérifier les versions
python --version
node --version
npm --version

# Vérifier les ports
lsof -i :5009 -i :5173

# Vérifier l'espace disque
df -h

# Vérifier la mémoire
free -h  # Linux
vm_stat  # macOS
```

---

**💡 Conseil** : Gardez ce fichier ouvert pendant le développement pour un accès rapide aux commandes ! 