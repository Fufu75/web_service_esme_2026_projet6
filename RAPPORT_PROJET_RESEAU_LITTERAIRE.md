# Rapport de Projet : Réseau Littéraire pour Ateliers d'Écriture

**ESME Sudria - Web Services 2026**  
**Projet 6 - Groupe 5**  
**Date : Juin 2025**

---

## 1. Équipe de Développement

| Membre | Rôle | Responsabilités |
|--------|------|----------------|
| **Gabin Fulcrand** |Développeur Fullstack |
| **Carla Simons** | Développeuse Frontend |
| **Hamza Hedna** | Développeur Backend |
| **Sacha Zeitoun** | Développeur Base de Données |
| **Vladimir-ilitch Mayagui** | DevOps & Tests |

---

## 2. Fonctionnalités Réalisées

### 🎯 Fonctionnalités Principales

#### **2.1 Gestion des Utilisateurs**
- ✅ Inscription et connexion sécurisée (JWT)
- ✅ Profils utilisateurs avec avatar et bio
- ✅ Système de rôles (user, admin)
- ✅ Page "Mon espace" avec statistiques personnalisées

#### **2.2 Publication d'Œuvres Littéraires**
- ✅ Création de textes (poème, roman, nouvelle, essai, autre)
- ✅ **Limitation de publication : 2 textes par semaine maximum**
- ✅ Association optionnelle à un livre existant
- ✅ Statuts : brouillon, publié, archivé
- ✅ Modification/suppression par l'auteur

#### **2.3 Système Social**
- ✅ **Système de likes/unlikes** temps réel
- ✅ **Commentaires avec notation** (1-5 étoiles)
- ✅ Historique d'activité complet
- ✅ Statistiques : likes reçus/donnés, commentaires

#### **2.4 Exploration et Filtrage**
- ✅ Page "Explorer" avec filtres par genre
- ✅ **Tri par popularité** (nombre de likes) ou date récente
- ✅ Recherche avancée
- ✅ Affichage des métadonnées (auteur, likes, commentaires)

#### **2.5 Fonctionnalités Avancées**
- ✅ Ateliers d'écriture avec inscription
- ✅ Groupes privés/publics
- ✅ Association textes-livres
- ✅ Interface responsive (mobile/desktop)

### 📊 Captures d'Écran Principales

```
🏠 Page d'Accueil
└── Résumé des œuvres récentes, ateliers actifs, groupes publics

🔍 Page Explorer  
└── Filtres par genre, tri popularité/récent, grille d'œuvres

✍️ Page Publier
└── Formulaire création, vérification limite publication

👤 Mon Espace
└── 4 onglets : Vue d'ensemble, Publications, Commentaires, Likes

📝 Détail d'une Œuvre
└── Contenu complet, commentaires, système de likes
```

---

## 3. Modèles de Données

### 🗃️ Diagramme Simplifié des Modèles

```
User (Utilisateur)
├── id, username, email, password_hash
├── role, profile_picture, bio
└── created_at, updated_at

LiteraryWork (Œuvre Littéraire)
├── id, title, content, type, status
├── author_id → User(id)
├── book_id → Book(id) [OPTIONNEL]
├── workshop_id → Workshop(id) [OPTIONNEL]
├── group_id → Group(id) [OPTIONNEL]
└── created_at, updated_at

Comment (Commentaire)
├── id, content, rating
├── user_id → User(id)
├── literary_work_id → LiteraryWork(id)
└── created_at

Book (Livre)
├── id, title, author, isbn
├── genre, publication_year
└── description

Workshop (Atelier)
├── id, title, description, status
├── organizer_id → User(id)
├── start_date, end_date
└── created_at

Group (Groupe)
├── id, name, description
├── creator_id → User(id)
├── is_private
└── created_at

Relations Many-to-Many:
├── literary_work_likes (User ↔ LiteraryWork)
├── workshop_participants (User ↔ Workshop)
└── group_members (User ↔ Group)
```

---

## 4. Cas d'Usage Détaillés

### 📝 **Cas d'Usage 1 : Publication d'un Texte**

**Acteur :** Utilisateur connecté  
**Prérequis :** Utilisateur authentifié, moins de 2 publications cette semaine

**Scénario principal :**
1. L'utilisateur accède à "Publier un texte"
2. Le système vérifie la limite de publication (2/semaine)
3. L'utilisateur saisit : titre, contenu, type (poème/roman/etc.)
4. [Optionnel] Association à un livre existant
5. [Optionnel] Publication dans un atelier/groupe
6. Validation et création de l'œuvre
7. Redirection vers la page de détail

**Scénario alternatif :**
- Si limite atteinte → Message d'erreur avec temps restant

### 💬 **Cas d'Usage 2 : Système de Commentaires**

**Acteur :** Utilisateur connecté  
**Prérequis :** Œuvre publiée accessible

**Scénario principal :**
1. L'utilisateur consulte une œuvre littéraire
2. Il saisit un commentaire dans le formulaire dédié
3. [Optionnel] Attribution d'une note (1-5 étoiles)
4. Validation et ajout du commentaire
5. Mise à jour temps réel de la liste des commentaires

### ❤️ **Cas d'Usage 3 : Système de Likes**

**Acteur :** Utilisateur connecté  
**Prérequis :** Œuvre publiée, utilisateur non-auteur

**Scénario principal :**
1. L'utilisateur clique sur le bouton "❤️" 
2. Le système vérifie qu'il n'a pas déjà liké
3. Ajout du like en base de données
4. Mise à jour immédiate du compteur
5. Mise à jour des statistiques utilisateur

**Scénario unlike :**
- Si déjà liké → Retrait du like et mise à jour

### 🚫 **Cas d'Usage 4 : Limitation de Publication**

**Acteur :** Système + Utilisateur  
**Déclencheur :** Tentative de publication

**Logique métier :**
1. Calcul des publications des 7 derniers jours
2. Si < 2 publications → Autorisation
3. Si = 2 publications → Blocage avec message explicite
4. Affichage du statut sur la page profil
5. Réinitialisation automatique après 7 jours

---

## 5. Problèmes Techniques et Solutions

### 🚨 **Problème 1 : Authentification JWT**
**Description :** Tokens expirés non gérés côté frontend  
**Solution :** 
- Implémentation d'un intercepteur pour renewal automatique
- Page de diagnostic pour debug des problèmes d'auth
- Gestion des erreurs 401/403 avec redirection

### 🚨 **Problème 2 : Performance des Requêtes**
**Description :** Requêtes N+1 sur les likes/commentaires  
**Solution :**
- Utilisation de `joinedload` SQLAlchemy
- Comptage optimisé avec `func.count()`
- Index sur les clés étrangères

### 🚨 **Problème 3 : CORS et Communication Frontend/Backend**
**Description :** Blocage des requêtes cross-origin  
**Solution :**
- Configuration Flask-CORS appropriée
- Headers Authorization standardisés
- Variables d'environnement pour URLs API

### 🚨 **Problème 4 : Limitation de Publication**
**Description :** Calcul complexe de la limite hebdomadaire  
**Solution :**
- Utilisation de `datetime.timedelta(days=7)`
- Route dédiée `/publication-limit` pour vérification
- Cache côté frontend pour éviter les appels répétés

### 🚨 **Problème 5 : État de l'Application React**
**Description :** Synchronisation des likes/commentaires  
**Solution :**
- State management local avec `useState`
- Mise à jour optimiste de l'interface
- Callbacks pour synchronisation parent/enfant

---

## 6. Technologies Utilisées

### **Backend**
- **Flask** : Framework web Python
- **SQLAlchemy** : ORM pour la base de données
- **Flask-JWT-Extended** : Authentification JWT
- **PostgreSQL** : Base de données relationnelle

### **Frontend**
- **React 18** : Framework JavaScript
- **Vite** : Build tool moderne
- **Fetch API** : Communication HTTP
- **CSS Modules** : Styling modulaire

### **DevOps**
- **Docker** : Containerisation
- **Git/GitHub** : Versioning et collaboration
- **Makefile** : Automatisation des tâches

---

## 7. Métriques du Projet

### **📊 Statistiques de Développement**
- **Durée :** 3 semaines de développement
- **Commits :** 20+ commits avec historique complet
- **Lignes de code :** ~8000 lignes (Backend + Frontend)
- **Routes API :** 25+ endpoints RESTful
- **Composants React :** 15+ composants modulaires

### **✅ Taux de Réalisation**
- **Fonctionnalités obligatoires :** 100%
- **Fonctionnalités bonus :** 85%
- **Tests unitaires :** 70%
- **Documentation :** 90%

---

## 8. Conclusion

Le projet **Réseau Littéraire pour Ateliers d'Écriture** a été développé avec succès, répondant à tous les critères du cahier des charges. L'équipe a su relever les défis techniques et livrer une application fullstack moderne, sécurisée et scalable.

Les fonctionnalités avancées (limitation de publication, système social, tri par popularité) démontrent notre maîtrise des technologies web modernes et notre capacité à traduire des besoins métier en solutions techniques robustes.

**Repository GitHub :** https://github.com/Fufu75/web_service_esme_2026_projet6

---

*Équipe ESME Sudria Groupe 5* 