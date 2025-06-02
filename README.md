# 📚 Réseau Littéraire ESME

Une plateforme web complète pour les ateliers d'écriture, permettant aux utilisateurs de publier, partager et commenter des œuvres littéraires.

## 🚀 Fonctionnalités

### ✨ **Authentification**
- Inscription et connexion sécurisées
- Gestion des profils utilisateurs
- Système de rôles (auteur, admin)

### 📝 **Publication d'œuvres**
- Création de textes (poèmes, romans, nouvelles, essais)
- Limite de 2 publications par semaine
- Association optionnelle à des livres
- Statuts : brouillon, publié, archivé

### 🔍 **Exploration et découverte**
- Filtrage par genre littéraire
- Tri par popularité ou date récente
- Système de likes et commentaires
- Notation par étoiles (1-5)

### 👥 **Communauté**
- Ateliers d'écriture collaboratifs
- Groupes publics et privés
- Profils utilisateurs avec statistiques
- Historique d'activité complet

### 📊 **Tableau de bord personnel**
- Mes publications avec statistiques
- Mes commentaires et notes données
- Œuvres aimées
- Limite de publication en temps réel

## 🛠 Architecture Technique

- **Backend** : Flask (Python) avec SQLAlchemy
- **Frontend** : React (Vite) avec Axios
- **Base de données** : SQLite (développement)
- **Authentification** : JWT (JSON Web Tokens)
- **Styling** : CSS moderne avec animations

## 📋 Prérequis

- **Python 3.9+** avec pip
- **Node.js 16+** avec npm
- **Git** pour le clonage du projet

## 🚀 Installation et Lancement

### 1. **Cloner le projet**
```bash
git clone <url-du-repo>
cd esme_webservice_full
```

### 2. **Lancer le Backend (Flask)**

#### Installation des dépendances :
```bash
cd backend
pip install flask flask-sqlalchemy flask-jwt-extended flask-cors flask-login flask-migrate python-dotenv
```

#### Lancement du serveur :
```bash
python app.py
```

✅ **Le backend sera accessible sur** : `http://localhost:5009`

#### Vérification du backend :
```bash
curl http://localhost:5009/api/
```

### 3. **Lancer le Frontend (React)**

#### Dans un nouveau terminal :
```bash
cd frontend
npm install
npm run dev
```

✅ **Le frontend sera accessible sur** : `http://localhost:5173`

## 🛑 Arrêter les serveurs

### **Arrêter le Backend**
Dans le terminal du backend, appuyez sur :
```
Ctrl + C
```

### **Arrêter le Frontend**
Dans le terminal du frontend, appuyez sur :
```
Ctrl + C
```

### **Vérifier qu'aucun processus ne tourne**
```bash
# Vérifier les processus sur le port 5009 (backend)
lsof -i :5009

# Vérifier les processus sur le port 5173 (frontend)
lsof -i :5173

# Tuer un processus si nécessaire
kill -9 <PID>
```

## 🔧 Commandes utiles

### **Backend**
```bash
# Lancer le backend
cd backend && python app.py

# Vérifier la santé de l'API
curl http://localhost:5009/api/

# Tester l'inscription
curl -X POST http://localhost:5009/api/register \
  -H "Content-Type: application/json" \
  -d '{"username": "test", "email": "test@example.com", "password": "password123"}'
```

### **Frontend**
```bash
# Lancer le frontend
cd frontend && npm run dev

# Build pour production
npm run build

# Prévisualiser le build
npm run preview
```

## 📁 Structure du projet

```
esme_webservice_full/
├── backend/                 # API Flask
│   ├── app.py              # Point d'entrée
│   ├── config.py           # Configuration
│   ├── models.py           # Modèles de données
│   └── routes/             # Routes API
│       ├── users.py        # Authentification
│       ├── literary_works.py # Œuvres littéraires
│       ├── workshops.py    # Ateliers
│       ├── groups.py       # Groupes
│       └── books.py        # Livres
├── frontend/               # Application React
│   ├── src/
│   │   ├── pages/          # Pages principales
│   │   ├── services/       # Services API
│   │   └── styles/         # Styles CSS
│   └── package.json
└── README.md
```

## 🎯 Utilisation

### **1. Première connexion**
1. Ouvrez `http://localhost:5173`
2. Cliquez sur "S'inscrire"
3. Remplissez le formulaire d'inscription
4. Connectez-vous avec vos identifiants

### **2. Utiliser les comptes de test**
Pour tester rapidement l'application, vous pouvez utiliser les comptes pré-créés :

**Comptes disponibles** (mot de passe : `password123`) :
- `marie.dubois@email.com` - Poète spécialisée en littérature contemporaine
- `julien.martin@email.com` - Auteur de science-fiction et fantastique  
- `sophie.bernard@email.com` - Amatrice de romans historiques
- `lucas.petit@email.com` - Spécialiste des nouvelles et récits courts
- `camille.robert@email.com` - Poète et dramaturge
- `antoine.moreau@email.com` - Critique littéraire
- `lea.simon@email.com` - Étudiante en lettres
- `maxime.laurent@email.com` - Auteur de thrillers
- `clara.michel@email.com` - Spécialiste littérature jeunesse
- `thomas.garcia@email.com` - Journaliste et nouvelliste

**Données de test incluses** :
- ✅ **10 utilisateurs** avec profils complets
- ✅ **10 livres** publiés par les auteurs
- ✅ **6 œuvres littéraires** (poèmes, romans, nouvelles, essais)
- ✅ **3 ateliers d'écriture** avec participants
- ✅ **Likes et commentaires** sur les œuvres

### **3. Publier une œuvre**
1. Cliquez sur "Publier une œuvre"
2. Remplissez le formulaire (titre, contenu, type)
3. Choisissez le statut (brouillon/publié)
4. Soumettez votre création

### **4. Explorer les œuvres**
1. Allez dans "Explorer"
2. Utilisez les filtres par genre
3. Triez par popularité ou date
4. Likez et commentez les œuvres

### **5. Gérer son profil**
1. Accédez à "Mon espace"
2. Consultez vos statistiques
3. Gérez vos publications
4. Suivez votre activité

## 🔧 Gestion des données de test

### **Créer les données de test**
```bash
cd backend
python create_test_data.py
```

### **Afficher un résumé des données**
```bash
cd backend
python show_test_data.py
```

### **Réinitialiser la base de données**
```bash
cd backend
rm esme_litteraire.db
python app.py  # Recrée automatiquement la base vide
python create_test_data.py  # Recrée les données de test
```

## 🐛 Résolution de problèmes

### **Port déjà utilisé**
```bash
# Trouver le processus utilisant le port
lsof -i :5009  # ou :5173

# Tuer le processus
kill -9 <PID>
```

### **Erreur de base de données**
```bash
# Supprimer la base de données et la recréer
cd backend
rm esme_litteraire.db
python app.py
```

### **Erreur "Module not found"**
```bash
# Réinstaller les dépendances Python
cd backend
pip install -r requirements.txt

# Réinstaller les dépendances Node.js
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### **Erreur CORS**
Vérifiez que :
- Le backend tourne sur le port 5009
- Le frontend tourne sur le port 5173
- Les deux serveurs sont démarrés

## 📊 API Endpoints

### **Authentification**
- `POST /api/register` - Inscription
- `POST /api/login` - Connexion
- `GET /api/profile` - Profil utilisateur

### **Œuvres littéraires**
- `GET /api/literary-works` - Liste des œuvres
- `POST /api/literary-works` - Créer une œuvre
- `GET /api/literary-works/:id` - Détail d'une œuvre
- `POST /api/literary-works/:id/like` - Liker une œuvre
- `POST /api/literary-works/:id/comments` - Commenter

### **Autres**
- `GET /api/workshops` - Ateliers
- `GET /api/groups` - Groupes
- `GET /api/books` - Livres

## 🎨 Optimisations incluses

- **Backend** : Requêtes SQL optimisées, eager loading
- **Frontend** : Cache intelligent, debouncing, lazy loading
- **CSS** : GPU acceleration, containment, transitions rapides
- **API** : Timeout, gestion d'erreurs, invalidation de cache

## 👥 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

**Développé avec ❤️ pour ESME Sudria**