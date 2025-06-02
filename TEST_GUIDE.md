# 🧪 Guide de Test - Réseau Littéraire ESME

## 🚀 Démarrage rapide

### 1. **Lancer l'application**
```bash
./start.sh
```
✅ Frontend : `http://localhost:5173`  
✅ Backend : `http://localhost:5009`

### 2. **Vérifier les données de test**
```bash
cd backend && python show_test_data.py
```

---

## 👥 Comptes de test disponibles

**Mot de passe pour tous** : `password123`

| Email | Utilisateur | Spécialité | Œuvres |
|-------|-------------|------------|---------|
| `marie.dubois@email.com` | marie_dubois | Poésie contemporaine | 1 poème |
| `julien.martin@email.com` | julien_martin | Science-fiction | 1 roman |
| `sophie.bernard@email.com` | sophie_bernard | Romans historiques | 1 roman |
| `lucas.petit@email.com` | lucas_petit | Nouvelles | 1 nouvelle |
| `camille.robert@email.com` | camille_robert | Poésie/Théâtre | 1 poème |
| `antoine.moreau@email.com` | antoine_moreau | Critique littéraire | 1 essai |

---

## 🧪 Scénarios de test

### **Test 1 : Connexion et exploration**
1. Ouvrir `http://localhost:5173`
2. Se connecter avec `marie.dubois@email.com` / `password123`
3. Explorer les œuvres dans "Explorer"
4. Filtrer par type (poème, roman, nouvelle, essai)
5. Trier par popularité vs date récente
6. Liker une œuvre
7. Ajouter un commentaire avec note (1-5 étoiles)

### **Test 2 : Publication d'œuvre**
1. Se connecter avec `julien.martin@email.com`
2. Aller dans "Publier une œuvre"
3. Vérifier la limite de publication (2/semaine)
4. Créer une nouvelle œuvre :
   - Titre : "Test Science-Fiction"
   - Type : Roman
   - Contenu : Votre texte
   - Statut : Publié
5. Vérifier qu'elle apparaît dans "Explorer"

### **Test 3 : Ateliers d'écriture**
1. Se connecter avec `lea.simon@email.com`
2. Aller dans "Ateliers"
3. Voir les ateliers disponibles :
   - Atelier Poésie Contemporaine (marie_dubois)
   - Écriture de Science-Fiction (julien_martin)
   - Roman Historique (sophie_bernard)
4. Rejoindre un atelier
5. Créer un nouvel atelier

### **Test 4 : Profil utilisateur**
1. Se connecter avec `camille.robert@email.com`
2. Aller dans "Mon espace"
3. Consulter les statistiques :
   - Mes publications
   - Likes reçus/donnés
   - Commentaires
4. Voir l'historique d'activité
5. Modifier le profil

### **Test 5 : Fonctionnalités avancées**
1. Se connecter avec `antoine.moreau@email.com`
2. Tester la recherche par auteur
3. Voir les détails d'une œuvre
4. Tester les filtres combinés
5. Vérifier les notifications de limite

---

## 🔍 Points à vérifier

### **Interface utilisateur**
- [ ] Navigation fluide entre les pages
- [ ] Responsive design (mobile/desktop)
- [ ] Chargement des données
- [ ] Messages d'erreur clairs
- [ ] Animations et transitions

### **Fonctionnalités**
- [ ] Authentification (connexion/déconnexion)
- [ ] Publication d'œuvres avec limite
- [ ] Système de likes/commentaires
- [ ] Filtres et tri des œuvres
- [ ] Création/participation aux ateliers
- [ ] Profil utilisateur complet

### **Performance**
- [ ] Temps de chargement < 2 secondes
- [ ] Cache intelligent fonctionnel
- [ ] Pas de requêtes inutiles
- [ ] Optimisations CSS actives

---

## 🐛 Tests d'erreurs

### **Test des limites**
1. Essayer de publier plus de 2 œuvres par semaine
2. Tenter de liker sa propre œuvre
3. Commenter sans être connecté
4. Accéder à un atelier privé

### **Test de validation**
1. Formulaires avec champs vides
2. Emails invalides
3. Mots de passe trop courts
4. Contenus trop longs

### **Test de sécurité**
1. Accès aux routes protégées sans token
2. Modification d'œuvres d'autres utilisateurs
3. Suppression d'ateliers non autorisée

---

## 📊 Métriques à surveiller

### **Backend**
```bash
# Vérifier les logs
tail -f backend/logs/app.log

# Tester les endpoints
curl http://localhost:5009/api/literary-works
curl http://localhost:5009/api/workshops
curl http://localhost:5009/api/groups
```

### **Frontend**
- Console du navigateur (F12)
- Network tab pour les requêtes
- Performance tab pour les optimisations

### **Base de données**
```bash
# Voir la taille de la DB
ls -lh backend/esme_litteraire.db

# Compter les enregistrements
cd backend && python show_test_data.py
```

---

## ✅ Checklist finale

### **Avant de livrer**
- [ ] Tous les tests passent
- [ ] Pas d'erreurs dans la console
- [ ] Documentation à jour
- [ ] Données de test créées
- [ ] Performance optimisée
- [ ] Sécurité vérifiée

### **Démonstration**
1. **Connexion** avec compte de test
2. **Explorer** les œuvres existantes
3. **Publier** une nouvelle œuvre
4. **Rejoindre** un atelier
5. **Consulter** son profil
6. **Interagir** (likes, commentaires)

---

## 🆘 En cas de problème

### **Reset complet**
```bash
./stop.sh
cd backend && rm esme_litteraire.db
cd frontend && rm -rf node_modules && npm install
./start.sh
cd backend && python create_test_data.py
```

### **Logs utiles**
```bash
# Backend
cd backend && python app.py

# Frontend  
cd frontend && npm run dev

# Données
cd backend && python show_test_data.py
```

---

**🎉 Bon test ! L'application est prête à être utilisée.** 