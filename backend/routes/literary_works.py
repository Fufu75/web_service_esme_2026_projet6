from flask import Blueprint, request, jsonify
from models import db, LiteraryWork, User, Comment, literary_work_likes
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from sqlalchemy.orm import joinedload
from sqlalchemy import func

literary_works_bp = Blueprint('literary_works', __name__)

def get_current_user_id():
    """Utilitaire pour obtenir l'ID utilisateur actuel depuis le JWT"""
    return int(get_jwt_identity())

@literary_works_bp.route('/literary-works', methods=['POST'])
@jwt_required()
def create_literary_work():
    current_user_id = get_current_user_id()
    data = request.get_json()
    
    # Vérification des champs requis
    if not all(key in data for key in ['title', 'content', 'type']):
        return jsonify({'error': 'Tous les champs requis doivent être remplis'}), 400
    
    # Vérification de la limite de publication (2 textes par semaine)
    one_week_ago = datetime.utcnow() - timedelta(days=7)
    recent_works = LiteraryWork.query.filter(
        LiteraryWork.author_id == current_user_id,
        LiteraryWork.created_at >= one_week_ago
    ).count()
    
    if recent_works >= 2:
        return jsonify({'error': 'Vous avez atteint la limite de 2 publications par semaine'}), 429
    
    # Création de l'œuvre littéraire
    new_work = LiteraryWork(
        title=data['title'],
        content=data['content'],
        type=data['type'],
        status=data.get('status', 'draft'),
        author_id=current_user_id,
        workshop_id=data.get('workshop_id'),
        group_id=data.get('group_id'),
        book_id=data.get('book_id')  # Ajout du book_id optionnel
    )
    
    db.session.add(new_work)
    db.session.commit()
    
    return jsonify({
        'message': 'Œuvre littéraire créée avec succès',
        'work': {
            'id': new_work.id,
            'title': new_work.title,
            'type': new_work.type,
            'status': new_work.status,
            'created_at': new_work.created_at.isoformat()
        }
    }), 201

@literary_works_bp.route('/literary-works', methods=['GET'])
def get_literary_works():
    # Paramètres de filtrage
    author_id = request.args.get('author_id', type=int)
    work_type = request.args.get('type')
    status = request.args.get('status')
    workshop_id = request.args.get('workshop_id', type=int)
    group_id = request.args.get('group_id', type=int)
    sort_by = request.args.get('sort_by', 'recent')  # 'recent', 'popularity'
    
    # Construction de la requête simplifiée
    query = LiteraryWork.query.join(User, LiteraryWork.author_id == User.id)
    
    # Filtres
    if author_id:
        query = query.filter(LiteraryWork.author_id == author_id)
    if work_type:
        query = query.filter(LiteraryWork.type == work_type)
    if status:
        query = query.filter(LiteraryWork.status == status)
    else:
        # Par défaut, ne montrer que les œuvres publiées si pas d'authentification
        query = query.filter(LiteraryWork.status == 'published')
    if workshop_id:
        query = query.filter(LiteraryWork.workshop_id == workshop_id)
    if group_id:
        query = query.filter(LiteraryWork.group_id == group_id)
    
    # Tri selon le paramètre
    if sort_by == 'popularity':
        # Pour le tri par popularité, on compte les likes
        query = query.outerjoin(literary_work_likes).group_by(LiteraryWork.id).order_by(func.count(literary_work_likes.c.user_id).desc())
    else:
        query = query.order_by(LiteraryWork.created_at.desc())
    
    # Exécution de la requête
    works = query.all()
    
    # Formatage de la réponse
    works_list = []
    for work in works:
        # Compter les likes et commentaires séparément
        likes_count = len(work.likes)
        comments_count = len(work.comments)
        
        work_data = {
            'id': work.id,
            'title': work.title,
            'type': work.type,
            'status': work.status,
            'created_at': work.created_at.isoformat(),
            'updated_at': work.updated_at.isoformat(),
            'author': {
                'id': work.author.id,
                'username': work.author.username,
                'profile_picture': work.author.profile_picture
            },
            'likes_count': likes_count,
            'comments_count': comments_count
        }
        
        # Ajouter les informations du livre si présent
        if work.book:
            work_data['book'] = {
                'id': work.book.id,
                'title': work.book.title,
                'author': work.book.author
            }
        
        works_list.append(work_data)
    
    return jsonify(works_list), 200

@literary_works_bp.route('/literary-works/<int:work_id>', methods=['GET'])
def get_literary_work(work_id):
    # Requête optimisée avec jointures
    work = LiteraryWork.query.options(
        joinedload(LiteraryWork.author),
        joinedload(LiteraryWork.comments).joinedload(Comment.user),
        joinedload(LiteraryWork.workshop),
        joinedload(LiteraryWork.group),
        joinedload(LiteraryWork.book),
        joinedload(LiteraryWork.likes)
    ).get(work_id)
    
    if not work:
        return jsonify({'error': 'Œuvre littéraire non trouvée'}), 404
    
    # Formatage de la réponse optimisé
    work_data = {
        'id': work.id,
        'title': work.title,
        'content': work.content,
        'type': work.type,
        'status': work.status,
        'created_at': work.created_at.isoformat(),
        'updated_at': work.updated_at.isoformat(),
        'author': {
            'id': work.author.id,
            'username': work.author.username,
            'profile_picture': work.author.profile_picture
        },
        'likes_count': len(work.likes),
        'likes': [{'id': user.id, 'username': user.username} for user in work.likes],
        'comments': [{
            'id': comment.id,
            'content': comment.content,
            'rating': comment.rating,
            'created_at': comment.created_at.isoformat(),
            'user': {
                'id': comment.user.id,
                'username': comment.user.username,
                'profile_picture': comment.user.profile_picture
            }
        } for comment in work.comments]
    }
    
    # Ajouter les informations sur le workshop si présent
    if work.workshop:
        work_data['workshop'] = {
            'id': work.workshop.id,
            'title': work.workshop.title
        }
    
    # Ajouter les informations sur le groupe si présent
    if work.group:
        work_data['group'] = {
            'id': work.group.id,
            'name': work.group.name
        }
    
    # Ajouter les informations du livre si présent
    if work.book:
        work_data['book'] = {
            'id': work.book.id,
            'title': work.book.title,
            'author': work.book.author
        }
    
    return jsonify(work_data), 200

@literary_works_bp.route('/literary-works/<int:work_id>', methods=['PUT'])
@jwt_required()
def update_literary_work(work_id):
    current_user_id = get_current_user_id()
    work = LiteraryWork.query.get(work_id)
    
    if not work:
        return jsonify({'error': 'Œuvre littéraire non trouvée'}), 404
    
    # Vérifier si l'utilisateur actuel est l'auteur
    if work.author_id != current_user_id:
        return jsonify({'error': 'Vous n\'êtes pas autorisé à modifier cette œuvre'}), 403
    
    data = request.get_json()
    
    # Mise à jour des champs
    if 'title' in data:
        work.title = data['title']
    if 'content' in data:
        work.content = data['content']
    if 'type' in data:
        work.type = data['type']
    if 'status' in data:
        work.status = data['status']
    if 'workshop_id' in data:
        work.workshop_id = data['workshop_id']
    if 'group_id' in data:
        work.group_id = data['group_id']
    if 'book_id' in data:
        work.book_id = data['book_id']
    
    # Mettre à jour la date de modification
    work.updated_at = datetime.utcnow()
    
    db.session.commit()
    
    return jsonify({
        'message': 'Œuvre littéraire mise à jour avec succès',
        'literary_work': {
            'id': work.id,
            'title': work.title,
            'type': work.type,
            'status': work.status,
            'updated_at': work.updated_at.isoformat()
        }
    }), 200

@literary_works_bp.route('/literary-works/<int:work_id>', methods=['DELETE'])
@jwt_required()
def delete_literary_work(work_id):
    current_user_id = get_current_user_id()
    work = LiteraryWork.query.get(work_id)
    
    if not work:
        return jsonify({'error': 'Œuvre littéraire non trouvée'}), 404
    
    # Vérifier si l'utilisateur actuel est l'auteur ou un admin
    user = User.query.get(current_user_id)
    if work.author_id != current_user_id and user.role != 'admin':
        return jsonify({'error': 'Vous n\'êtes pas autorisé à supprimer cette œuvre'}), 403
    
    # Supprimer l'œuvre
    db.session.delete(work)
    db.session.commit()
    
    return jsonify({'message': 'Œuvre littéraire supprimée avec succès'}), 200

@literary_works_bp.route('/literary-works/<int:work_id>/like', methods=['POST'])
@jwt_required()
def like_literary_work(work_id):
    current_user_id = get_current_user_id()
    work = LiteraryWork.query.get(work_id)
    user = User.query.get(current_user_id)
    
    if not work or not user:
        return jsonify({'error': 'Œuvre littéraire ou utilisateur non trouvé'}), 404
    
    # Vérifier si l'utilisateur a déjà aimé cette œuvre
    if user in work.likes:
        return jsonify({'error': 'Vous avez déjà aimé cette œuvre'}), 400
    
    # Ajouter le like
    work.likes.append(user)
    db.session.commit()
    
    return jsonify({
        'message': 'Like ajouté avec succès',
        'likes_count': len(work.likes)
    }), 200

@literary_works_bp.route('/literary-works/<int:work_id>/unlike', methods=['POST'])
@jwt_required()
def unlike_literary_work(work_id):
    current_user_id = get_current_user_id()
    work = LiteraryWork.query.get(work_id)
    user = User.query.get(current_user_id)
    
    if not work or not user:
        return jsonify({'error': 'Œuvre littéraire ou utilisateur non trouvé'}), 404
    
    # Vérifier si l'utilisateur a aimé cette œuvre
    if user not in work.likes:
        return jsonify({'error': 'Vous n\'avez pas aimé cette œuvre'}), 400
    
    # Retirer le like
    work.likes.remove(user)
    db.session.commit()
    
    return jsonify({
        'message': 'Like retiré avec succès',
        'likes_count': len(work.likes)
    }), 200

@literary_works_bp.route('/literary-works/<int:work_id>/comments', methods=['POST'])
@jwt_required()
def add_comment(work_id):
    current_user_id = get_current_user_id()
    work = LiteraryWork.query.get(work_id)
    
    if not work:
        return jsonify({'error': 'Œuvre littéraire non trouvée'}), 404
    
    data = request.get_json()
    
    if 'content' not in data or not data['content'].strip():
        return jsonify({'error': 'Le contenu du commentaire est requis'}), 400
    
    # Création du commentaire
    new_comment = Comment(
        content=data['content'],
        rating=data.get('rating'),
        user_id=current_user_id,
        literary_work_id=work_id
    )
    
    db.session.add(new_comment)
    db.session.commit()
    
    return jsonify({
        'message': 'Commentaire ajouté avec succès',
        'comment': {
            'id': new_comment.id,
            'content': new_comment.content,
            'rating': new_comment.rating,
            'created_at': new_comment.created_at.isoformat(),
            'user': {
                'id': new_comment.user.id,
                'username': new_comment.user.username
            }
        }
    }), 201 

@literary_works_bp.route('/literary-works/publication-limit', methods=['GET'])
@jwt_required()
def check_publication_limit():
    current_user_id = get_current_user_id()
    
    # Vérifier combien de publications ont été faites cette semaine
    one_week_ago = datetime.utcnow() - timedelta(days=7)
    recent_works = LiteraryWork.query.filter(
        LiteraryWork.author_id == current_user_id,
        LiteraryWork.created_at >= one_week_ago
    ).count()
    
    remaining_publications = max(0, 2 - recent_works)
    
    return jsonify({
        'publications_this_week': recent_works,
        'remaining_publications': remaining_publications,
        'limit': 2,
        'can_publish': remaining_publications > 0
    }), 200 