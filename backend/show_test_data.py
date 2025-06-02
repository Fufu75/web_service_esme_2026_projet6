#!/usr/bin/env python3
"""
Script pour afficher un résumé des données de test créées
"""

import sys
import os

# Ajouter le répertoire parent au path pour importer les modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app
from models import db, User, Book, LiteraryWork, Workshop, Group, Comment

def show_summary():
    """Afficher un résumé des données"""
    print("📊 Résumé des données du Réseau Littéraire ESME")
    print("=" * 50)
    
    with app.app_context():
        # Compter les éléments
        users_count = User.query.count()
        books_count = Book.query.count()
        works_count = LiteraryWork.query.count()
        workshops_count = Workshop.query.count()
        comments_count = Comment.query.count()
        
        print(f"👥 Utilisateurs: {users_count}")
        print(f"📚 Livres: {books_count}")
        print(f"✍️  Œuvres littéraires: {works_count}")
        print(f"🎭 Ateliers: {workshops_count}")
        print(f"💬 Commentaires: {comments_count}")
        
        print("\n👥 Utilisateurs créés:")
        users = User.query.all()
        for user in users:
            works_by_user = LiteraryWork.query.filter_by(author_id=user.id).count()
            print(f"  - {user.username} ({user.email}) - {works_by_user} œuvres")
        
        print("\n📚 Livres disponibles:")
        books = Book.query.all()
        for book in books:
            print(f"  - \"{book.title}\" par {book.author}")
        
        print("\n✍️  Œuvres littéraires publiées:")
        works = LiteraryWork.query.filter_by(status='published').all()
        for work in works:
            likes_count = len(work.likes)
            comments_count = len(work.comments)
            print(f"  - \"{work.title}\" ({work.type}) par {work.author.username}")
            print(f"    💖 {likes_count} likes, 💬 {comments_count} commentaires")
        
        print("\n🎭 Ateliers actifs:")
        workshops = Workshop.query.all()
        for workshop in workshops:
            participants_count = len(workshop.participants)
            print(f"  - \"{workshop.title}\" ({workshop.theme})")
            print(f"    👨‍🏫 Créé par {workshop.creator.username}, 👥 {participants_count} participants")
            print(f"    📅 Statut: {workshop.status}")
        
        print("\n🔑 Comptes de test (mot de passe: password123):")
        for user in users:
            print(f"  - {user.email}")

if __name__ == "__main__":
    show_summary() 