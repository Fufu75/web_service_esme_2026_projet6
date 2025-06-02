#!/usr/bin/env python3
"""
Script pour créer des données de test pour le réseau littéraire ESME
"""

import sys
import os
from datetime import datetime, timedelta
import random

# Ajouter le répertoire parent au path pour importer les modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app
from models import db, User, Book, LiteraryWork, Workshop, Group, Comment

# Données de test
USERS_DATA = [
    {
        'username': 'marie_dubois',
        'email': 'marie.dubois@email.com',
        'password': 'password123',
        'first_name': 'Marie',
        'last_name': 'Dubois',
        'bio': 'Passionnée de poésie et de littérature contemporaine. J\'aime explorer les émotions à travers les mots.'
    },
    {
        'username': 'julien_martin',
        'email': 'julien.martin@email.com',
        'password': 'password123',
        'first_name': 'Julien',
        'last_name': 'Martin',
        'bio': 'Écrivain en herbe, spécialisé dans la science-fiction et le fantastique.'
    },
    {
        'username': 'sophie_bernard',
        'email': 'sophie.bernard@email.com',
        'password': 'password123',
        'first_name': 'Sophie',
        'last_name': 'Bernard',
        'bio': 'Amatrice de romans historiques et d\'essais philosophiques.'
    },
    {
        'username': 'lucas_petit',
        'email': 'lucas.petit@email.com',
        'password': 'password123',
        'first_name': 'Lucas',
        'last_name': 'Petit',
        'bio': 'Jeune auteur passionné par les nouvelles et les récits courts.'
    },
    {
        'username': 'camille_robert',
        'email': 'camille.robert@email.com',
        'password': 'password123',
        'first_name': 'Camille',
        'last_name': 'Robert',
        'bio': 'Poète et dramaturge, j\'explore les thèmes de l\'amour et de la nature.'
    },
    {
        'username': 'antoine_moreau',
        'email': 'antoine.moreau@email.com',
        'password': 'password123',
        'first_name': 'Antoine',
        'last_name': 'Moreau',
        'bio': 'Critique littéraire et auteur d\'essais sur la littérature moderne.'
    },
    {
        'username': 'lea_simon',
        'email': 'lea.simon@email.com',
        'password': 'password123',
        'first_name': 'Léa',
        'last_name': 'Simon',
        'bio': 'Étudiante en lettres, passionnée par l\'écriture créative et les ateliers collaboratifs.'
    },
    {
        'username': 'maxime_laurent',
        'email': 'maxime.laurent@email.com',
        'password': 'password123',
        'first_name': 'Maxime',
        'last_name': 'Laurent',
        'bio': 'Auteur de thrillers psychologiques et de romans noirs.'
    },
    {
        'username': 'clara_michel',
        'email': 'clara.michel@email.com',
        'password': 'password123',
        'first_name': 'Clara',
        'last_name': 'Michel',
        'bio': 'Spécialiste de la littérature jeunesse et conteuse d\'histoires fantastiques.'
    },
    {
        'username': 'thomas_garcia',
        'email': 'thomas.garcia@email.com',
        'password': 'password123',
        'first_name': 'Thomas',
        'last_name': 'Garcia',
        'bio': 'Journaliste et auteur de nouvelles inspirées de faits divers.'
    }
]

BOOKS_DATA = [
    {
        'title': 'Les Murmures du Temps',
        'author': 'Marie Dubois'
    },
    {
        'title': 'Chroniques Galactiques',
        'author': 'Julien Martin'
    },
    {
        'title': 'Secrets de Versailles',
        'author': 'Sophie Bernard'
    },
    {
        'title': 'Nouvelles du Quotidien',
        'author': 'Lucas Petit'
    },
    {
        'title': 'Jardins de l\'Âme',
        'author': 'Camille Robert'
    },
    {
        'title': 'Réflexions Littéraires',
        'author': 'Antoine Moreau'
    },
    {
        'title': 'L\'Art de Raconter',
        'author': 'Léa Simon'
    },
    {
        'title': 'Dans l\'Ombre du Doute',
        'author': 'Maxime Laurent'
    },
    {
        'title': 'Contes Enchantés',
        'author': 'Clara Michel'
    },
    {
        'title': 'Faits Divers Extraordinaires',
        'author': 'Thomas Garcia'
    }
]

LITERARY_WORKS_DATA = [
    {
        'title': 'Le Souffle du Vent',
        'content': '''Le vent murmure des secrets anciens,
Portant les rêves d'hier vers demain.
Dans ses caresses, je trouve la paix,
Et dans son chant, l'écho de mes souhaits.

Ô vent léger, messager des saisons,
Tu danses avec les feuilles d'automne,
Tu chantes avec les oiseaux du printemps,
Et berces les fleurs de l'été naissant.''',
        'type': 'poem',
        'status': 'published'
    },
    {
        'title': 'Voyage Intersidéral',
        'content': '''L'année 2387. Le vaisseau Odyssée traverse la nébuleuse d'Andromède quand soudain, les instruments détectent une anomalie. Le capitaine Sarah Chen observe les écrans avec inquiétude.

"Rapport, lieutenant !"

"Capitaine, nous détectons une structure artificielle à 10 000 kilomètres. Elle ne correspond à aucune technologie connue."

Sarah fronce les sourcils. Après trois siècles d'exploration spatiale, l'humanité pensait avoir cartographié tous les secteurs habités. Cette découverte pourrait changer le cours de l'histoire...''',
        'type': 'novel',
        'status': 'published'
    },
    {
        'title': 'La Dame de Compagnie',
        'content': '''Château de Versailles, 1682. Marguerite de Montclair ajuste sa robe de soie bleue avant d'entrer dans les appartements de Madame de Maintenon. En tant que dame de compagnie, elle connaît tous les secrets de la cour, mais aujourd'hui, elle porte un message qui pourrait ébranler le royaume.

Le roi Louis XIV ne sait pas encore que sa favorite entretient une correspondance secrète avec les jansénistes. Marguerite hésite : doit-elle révéler ce qu'elle sait et risquer sa position, ou garder le silence et devenir complice d'une possible trahison ?''',
        'type': 'novel',
        'status': 'published'
    },
    {
        'title': 'Le Café du Coin',
        'content': '''Chaque matin à 7h30, Monsieur Durand commande le même café serré au comptoir du bistrot de la rue Mouffetard. Derrière ses lunettes épaisses, ses yeux observent le ballet quotidien des habitués.

Il y a Madame Petit qui achète ses croissants, le jeune étudiant qui révise ses cours, la fleuriste qui prépare ses bouquets. Tous ces gens qui se croisent sans se voir vraiment.

Mais ce matin-là, quelque chose change. Une jeune femme entre, commande un thé à la menthe, et sourit à Monsieur Durand. Un simple sourire qui va transformer sa journée, puis sa semaine, puis sa vie...''',
        'type': 'short_story',
        'status': 'published'
    },
    {
        'title': 'Aurore Printanière',
        'content': '''Les cerisiers en fleurs dansent dans la brise,
Leurs pétales roses voltigent comme des rêves.
L'aurore caresse les toits de la ville,
Et mon cœur s'éveille à cette beauté nouvelle.

Printemps, tu reviens avec tes promesses,
Tes bourgeons tendres et tes chants d'oiseaux.
Tu peins le monde de couleurs douces,
Et rallumes l'espoir dans nos cœurs las.''',
        'type': 'poem',
        'status': 'published'
    },
    {
        'title': 'L\'Évolution du Roman Français',
        'content': '''Le roman français a connu de profondes mutations depuis le XIXe siècle. De Balzac à Houellebecq, en passant par Proust et le Nouveau Roman, chaque époque a apporté ses innovations narratives et stylistiques.

L'émergence du réalisme avec Balzac et Zola a marqué une rupture avec le romantisme. Ces auteurs ont voulu peindre la société de leur temps avec une précision quasi-scientifique. Puis Proust a révolutionné l'approche du temps et de la mémoire dans "À la recherche du temps perdu".

Le XXe siècle a vu naître le Nouveau Roman avec Robbe-Grillet et Sarraute, remettant en question les codes narratifs traditionnels. Aujourd'hui, la littérature française continue d'évoluer, intégrant les enjeux contemporains tout en préservant sa richesse stylistique.''',
        'type': 'essay',
        'status': 'published'
    }
]

WORKSHOPS_DATA = [
    {
        'title': 'Atelier Poésie Contemporaine',
        'description': 'Un atelier pour explorer les formes modernes de la poésie et développer son style personnel. Nous travaillerons sur le rythme, les images et la musicalité des vers.',
        'theme': 'Poésie',
        'status': 'active'
    },
    {
        'title': 'Écriture de Science-Fiction',
        'description': 'Plongez dans l\'univers de la science-fiction ! Création de mondes, développement de technologies futuristes et exploration des enjeux sociétaux à travers le prisme du futur.',
        'theme': 'Science-Fiction',
        'status': 'planning'
    },
    {
        'title': 'Roman Historique : Techniques et Recherches',
        'description': 'Apprenez à mélanger fiction et réalité historique. Méthodes de recherche, reconstitution d\'époque et création de personnages authentiques.',
        'theme': 'Histoire',
        'status': 'active'
    }
]

def create_users():
    """Créer les utilisateurs de test"""
    print("Création des utilisateurs...")
    users = []
    
    for user_data in USERS_DATA:
        # Vérifier si l'utilisateur existe déjà
        existing_user = User.query.filter_by(email=user_data['email']).first()
        if existing_user:
            print(f"  - {user_data['username']} existe déjà")
            users.append(existing_user)
            continue
            
        user = User(
            username=user_data['username'],
            email=user_data['email'],
            first_name=user_data['first_name'],
            last_name=user_data['last_name'],
            bio=user_data['bio'],
            role='author'
        )
        user.set_password(user_data['password'])
        
        db.session.add(user)
        users.append(user)
        print(f"  - Créé: {user_data['username']}")
    
    db.session.commit()
    return users

def create_books(users):
    """Créer les livres de test"""
    print("Création des livres...")
    books = []
    
    for i, book_data in enumerate(BOOKS_DATA):
        # Vérifier si le livre existe déjà
        existing_book = Book.query.filter_by(title=book_data['title']).first()
        if existing_book:
            print(f"  - {book_data['title']} existe déjà")
            books.append(existing_book)
            continue
            
        # Assigner le livre à un utilisateur
        user = users[i % len(users)]
        
        book = Book(
            title=book_data['title'],
            author=book_data['author'],
            published_at=datetime.utcnow() - timedelta(days=random.randint(30, 365))
        )
        
        db.session.add(book)
        books.append(book)
        print(f"  - Créé: {book_data['title']} par {book_data['author']}")
    
    db.session.commit()
    return books

def create_literary_works(users, books):
    """Créer les œuvres littéraires de test"""
    print("Création des œuvres littéraires...")
    works = []
    
    for i, work_data in enumerate(LITERARY_WORKS_DATA):
        # Vérifier si l'œuvre existe déjà
        existing_work = LiteraryWork.query.filter_by(title=work_data['title']).first()
        if existing_work:
            print(f"  - {work_data['title']} existe déjà")
            works.append(existing_work)
            continue
            
        # Assigner l'œuvre à un utilisateur
        user = users[i % len(users)]
        
        # Assigner parfois un livre (50% de chance)
        book = books[i % len(books)] if random.choice([True, False]) else None
        
        work = LiteraryWork(
            title=work_data['title'],
            content=work_data['content'],
            type=work_data['type'],
            status=work_data['status'],
            author_id=user.id,
            book_id=book.id if book else None,
            created_at=datetime.utcnow() - timedelta(days=random.randint(1, 30))
        )
        
        db.session.add(work)
        works.append(work)
        print(f"  - Créé: {work_data['title']} par {user.username}")
    
    db.session.commit()
    return works

def create_workshops(users):
    """Créer les ateliers de test"""
    print("Création des ateliers...")
    workshops = []
    
    for i, workshop_data in enumerate(WORKSHOPS_DATA):
        # Vérifier si l'atelier existe déjà
        existing_workshop = Workshop.query.filter_by(title=workshop_data['title']).first()
        if existing_workshop:
            print(f"  - {workshop_data['title']} existe déjà")
            workshops.append(existing_workshop)
            continue
            
        # Assigner l'atelier à un créateur
        creator = users[i % 3]  # Les 3 premiers utilisateurs créent les ateliers
        
        workshop = Workshop(
            title=workshop_data['title'],
            description=workshop_data['description'],
            theme=workshop_data['theme'],
            status=workshop_data['status'],
            creator_id=creator.id,
            start_date=datetime.utcnow() + timedelta(days=random.randint(1, 30)),
            end_date=datetime.utcnow() + timedelta(days=random.randint(31, 90))
        )
        
        db.session.add(workshop)
        db.session.commit()  # Commit pour obtenir l'ID
        
        # Ajouter le créateur comme participant
        workshop.participants.append(creator)
        
        # Ajouter d'autres participants (2-4 personnes)
        num_participants = random.randint(2, 4)
        available_users = [u for u in users if u.id != creator.id]
        participants = random.sample(available_users, min(num_participants, len(available_users)))
        
        for participant in participants:
            workshop.participants.append(participant)
        
        workshops.append(workshop)
        print(f"  - Créé: {workshop_data['title']} par {creator.username} ({len(workshop.participants)} participants)")
    
    db.session.commit()
    return workshops

def create_likes_and_comments(users, works):
    """Créer des likes et commentaires"""
    print("Création des likes et commentaires...")
    
    comments_data = [
        "Magnifique ! Votre style est vraiment captivant.",
        "J'ai adoré cette histoire, très émouvante.",
        "Excellent travail, continuez comme ça !",
        "Une belle réflexion sur la condition humaine.",
        "Votre poésie me touche beaucoup.",
        "Très original, j'ai hâte de lire la suite.",
        "Bravo pour cette œuvre, elle m'a fait réfléchir.",
        "Un style unique et une histoire prenante.",
        "Merci pour ce moment de lecture agréable.",
        "Votre imagination est sans limites !"
    ]
    
    for work in works:
        # Ajouter des likes (30-70% des utilisateurs)
        num_likes = random.randint(int(len(users) * 0.3), int(len(users) * 0.7))
        likers = random.sample(users, num_likes)
        
        for liker in likers:
            if liker.id != work.author_id:  # Pas de self-like
                work.likes.append(liker)
        
        # Ajouter des commentaires (10-30% des utilisateurs)
        num_comments = random.randint(int(len(users) * 0.1), int(len(users) * 0.3))
        commenters = random.sample(users, num_comments)
        
        for commenter in commenters:
            if commenter.id != work.author_id:  # Pas de self-comment
                comment = Comment(
                    content=random.choice(comments_data),
                    rating=random.randint(3, 5),
                    user_id=commenter.id,
                    literary_work_id=work.id,
                    created_at=datetime.utcnow() - timedelta(days=random.randint(1, 15))
                )
                db.session.add(comment)
        
        print(f"  - {work.title}: {len(likers)} likes, {num_comments} commentaires")
    
    db.session.commit()

def main():
    """Fonction principale"""
    print("🚀 Création des données de test pour le Réseau Littéraire ESME")
    print("=" * 60)
    
    with app.app_context():
        try:
            # Créer les tables si elles n'existent pas
            db.create_all()
            
            # Créer les données
            users = create_users()
            books = create_books(users)
            works = create_literary_works(users, books)
            workshops = create_workshops(users)
            create_likes_and_comments(users, works)
            
            print("\n✅ Données de test créées avec succès !")
            print(f"   - {len(users)} utilisateurs")
            print(f"   - {len(books)} livres")
            print(f"   - {len(works)} œuvres littéraires")
            print(f"   - {len(workshops)} ateliers")
            
            print("\n📋 Comptes de test créés :")
            for user_data in USERS_DATA:
                print(f"   - {user_data['username']} / {user_data['email']} / password123")
            
        except Exception as e:
            print(f"❌ Erreur lors de la création des données : {e}")
            db.session.rollback()
            return 1
    
    return 0

if __name__ == "__main__":
    exit(main()) 