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

### Gestion des ateliers d'écriture
La mise en place des ateliers d'écriture a nécessité une attention particulière à plusieurs aspects :

1. **Gestion des participants** : Nous avons implémenté une relation many-to-many pour permettre aux utilisateurs de rejoindre ou quitter un atelier. La synchronisation de l'état entre le backend et le frontend lors de ces actions a nécessité une gestion fine des erreurs et des mises à jour d'état.

2. **Affichage conditionnel des actions** : Les actions disponibles pour un atelier varient selon que l'utilisateur est le créateur, un participant ou un simple visiteur. Nous avons mis en place une logique conditionnelle pour adapter l'interface en fonction du rôle de l'utilisateur.

3. **Workflow des ateliers** : Le cycle de vie d'un atelier (planification, en cours, terminé) a été géré à travers un système de statuts qui modifie à la fois l'apparence visuelle et les actions disponibles.

### Système de likes et commentaires
L'implémentation du système d'interaction sociale a posé plusieurs défis :

1. **État de like** : Le suivi de l'état "aimé/non aimé" pour chaque œuvre nécessite une synchronisation précise entre le backend et le frontend, particulièrement lors de la navigation entre les pages.

2. **Commentaires avec notation** : Nous avons développé un système permettant aux utilisateurs de laisser des commentaires accompagnés d'une note sur 5 étoiles, ce qui implique une gestion plus complexe des formulaires et de la validation.

3. **Mise à jour en temps réel** : Pour éviter des rechargements complets lors de l'ajout de commentaires ou de likes, nous avons implémenté des mises à jour locales de l'état qui s'exécutent immédiatement après l'action de l'utilisateur.

### Gestion des profils utilisateurs
La création d'un système de profil robuste a nécessité :

1. **Contrôle d'accès** : Les utilisateurs ne peuvent modifier que leur propre profil, ce qui implique des vérifications d'identité à la fois côté client et serveur.

2. **Affichage contextuel** : Le profil s'adapte selon qu'il s'agit du profil de l'utilisateur courant ou d'un autre utilisateur, avec des options et actions différentes.

3. **Agrégation de données** : Le profil affiche un résumé des activités de l'utilisateur (œuvres, ateliers, groupes) qui nécessite plusieurs requêtes API optimisées.

### Gestion des groupes littéraires
L'implémentation des groupes littéraires a présenté plusieurs défis techniques et conceptuels :

1. **Modération des groupes** : Nous avons dû mettre en place un système où le créateur du groupe a des droits spécifiques (modifier, supprimer, ajouter/retirer des membres) différents des simples membres. Cette distinction a nécessité une logique de vérification d'identité et de rôle à chaque action.

2. **Groupes publics et privés** : La gestion de la confidentialité des groupes a requis la mise en place de règles d'accès spécifiques. Les groupes privés ne sont accessibles que sur invitation, ce qui a impliqué de modifier le comportement de l'API pour les demandes d'adhésion.

3. **Relation œuvres-groupes** : La mise en place d'une relation many-to-many entre les œuvres et les groupes a nécessité une attention particulière pour garantir l'intégrité des données, notamment lors de la suppression d'un groupe ou d'une œuvre.

4. **Interface contextuelle** : L'interface utilisateur a été conçue pour s'adapter dynamiquement selon le type de groupe (public/privé) et le rôle de l'utilisateur (créateur/membre/non-membre), ce qui a nécessité une gestion fine des conditions d'affichage des actions disponibles.

### Validation des données
Pour assurer la robustesse de l'application, nous avons implémenté :

1. Une validation côté client avec des messages d'erreur contextuels
2. Une validation côté serveur pour garantir l'intégrité des données
3. Des contrôles d'accès pour protéger les ressources

### Performances
Pour optimiser les performances :

1. Nous avons limité les requêtes API en combinant certaines opérations
2. Utilisé le lazy loading pour les composants React non critiques
3. Mis en place une pagination pour les listes d'œuvres, d'ateliers et de groupes

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