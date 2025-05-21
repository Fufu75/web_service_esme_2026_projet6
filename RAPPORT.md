# Rapport - Projet 6 : Réseau Littéraire pour Ateliers d'Écriture

## Introduction
Ce rapport documente le développement d'un réseau social littéraire destiné aux ateliers d'écriture. Ce projet a été réalisé dans le cadre du cours de développement web fullstack, basé sur le squelette de projet fourni (Flask + React + PostgreSQL).

## Architecture technique

### Backend
- **Framework** : Flask (Python)
- **Base de données** : PostgreSQL
- **ORM** : SQLAlchemy
- **Migrations** : Flask-Migrate

### Frontend
- **Framework** : React avec Vite
- **Router** : React Router
- **Style** : CSS personnalisé avec approche responsive

### Déploiement
- **Containerisation** : Docker et Docker Compose
- **Environnement** : Développement local

## Modèles de données

Le système repose sur plusieurs entités principales :

1. **User** (Utilisateur)
   - Rôles : auteur, modérateur, admin
   - Informations de profil
   - Relations avec les groupes et publications

2. **Literary Work** (Œuvre littéraire)
   - Types : poème, nouvelle, roman, etc.
   - Contenu et métadonnées
   - Statut de publication

3. **Workshop** (Atelier d'écriture)
   - Thème et objectifs
   - Participants
   - Calendrier

4. **Comment** (Commentaire)
   - Critique constructive
   - Notation

5. **Group** (Groupe)
   - Communauté thématique
   - Membres et administrateurs

## Fonctionnalités implémentées

### Authentification et gestion utilisateur
- Inscription et connexion
- Gestion des profils
- Système de rôles et permissions

### Gestion des contenus littéraires
- Publication d'œuvres
- Catégorisation
- Recherche et filtrage

### Interactions sociales
- Système de commentaires
- Likes et partages
- Notifications

### Ateliers d'écriture
- Création et participation
- Exercices collectifs
- Système d'évaluation par les pairs

### Administration
- Modération des contenus
- Gestion des utilisateurs
- Statistiques et rapports

## Choix d'implémentation

### Sécurité
- JWT pour l'authentification
- Validation des données côté serveur
- Protection CSRF
- Sanitisation des entrées utilisateur

### Performance
- Optimisation des requêtes SQL
- Mise en cache sélective
- Lazy loading des composants React

### Expérience utilisateur
- Interface intuitive et responsive
- Feedback immédiat
- Mode sombre/clair

## Difficultés rencontrées et solutions

(Cette section sera complétée au fur et à mesure du développement)

## Perspectives d'amélioration

- Fonctionnalités d'IA pour suggérer des améliorations d'écriture
- Système de publication et diffusion externe
- Applications mobiles natives
- Intégration avec des plateformes d'édition

## Conclusion

Ce projet démontre la mise en œuvre d'une application web fullstack moderne, combinant une API RESTful avec Flask et une interface utilisateur interactive avec React. L'architecture choisie permet une évolution future du produit tout en maintenant de bonnes performances et une excellente expérience utilisateur.

---

## Guide d'installation et déploiement

### Prérequis
- Docker et Docker Compose
- Git

### Installation locale
1. Cloner le repository
   ```bash
   git clone [URL_DU_REPOSITORY]
   cd [NOM_DU_DOSSIER]
   ```

2. Lancer l'application
   ```bash
   make docker-build
   ```

3. Initialiser la base de données
   ```bash
   make db-init
   make db-migrate
   make db-upgrade
   ```

4. Accéder à l'application
   - Frontend : http://localhost:3000
   - API : http://localhost:5009 