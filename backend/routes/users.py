from flask import Blueprint, request, jsonify
from models import db, User, LiteraryWork, Comment
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
import re

users_bp = Blueprint('users', __name__)

def get_current_user_id():
    """Utilitaire pour obtenir l'ID utilisateur actuel depuis le JWT"""
    return int(get_jwt_identity())

@users_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validation des données
    if not all(key in data for key in ['username', 'email', 'password']):
        return jsonify({'error': 'Tous les champs requis doivent être remplis'}), 400
    
    # Vérifier si l'email est valide
    if not re.match(r"[^@]+@[^@]+\.[^@]+", data['email']):
        return jsonify({'error': 'Format d\'email invalide'}), 400
    
    # Vérifier si l'utilisateur existe déjà
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Ce nom d\'utilisateur est déjà pris'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Cet email est déjà utilisé'}), 400
    
    # Créer un nouvel utilisateur
    new_user = User(
        username=data['username'],
        email=data['email'],
        first_name=data.get('first_name', ''),
        last_name=data.get('last_name', ''),
        bio=data.get('bio', ''),
        role='author'  # Rôle par défaut
    )
    new_user.set_password(data['password'])
    
    # Sauvegarder dans la base de données
    db.session.add(new_user)
    db.session.commit()
    
    # Créer un token JWT pour l'authentification
    access_token = create_access_token(
        identity=str(new_user.id),
        additional_claims={'role': new_user.role},
        expires_delta=timedelta(days=1)
    )
    
    return jsonify({
        'message': 'Utilisateur créé avec succès',
        'user': {
            'id': new_user.id,
            'username': new_user.username,
            'email': new_user.email,
            'role': new_user.role
        },
        'access_token': access_token
    }), 201

@users_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not all(key in data for key in ['email', 'password']):
        return jsonify({'error': 'Email et mot de passe requis'}), 400
    
    # Rechercher l'utilisateur par email
    user = User.query.filter_by(email=data['email']).first()
    
    # Vérifier si l'utilisateur existe et si le mot de passe est correct
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Email ou mot de passe incorrect'}), 401
    
    # Créer un token JWT
    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={'role': user.role},
        expires_delta=timedelta(days=1)
    )
    
    return jsonify({
        'message': 'Connexion réussie',
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role
        },
        'access_token': access_token
    }), 200

@users_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user_id = get_current_user_id()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'Utilisateur non trouvé'}), 404
    
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'bio': user.bio,
        'profile_picture': user.profile_picture,
        'role': user.role,
        'created_at': user.created_at.isoformat()
    }), 200

@users_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    current_user_id = get_current_user_id()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'Utilisateur non trouvé'}), 404
    
    data = request.get_json()
    
    # Mettre à jour les champs autorisés
    if 'username' in data and data['username'] != user.username:
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Ce nom d\'utilisateur est déjà pris'}), 400
        user.username = data['username']
    
    if 'email' in data and data['email'] != user.email:
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Cet email est déjà utilisé'}), 400
        user.email = data['email']
    
    # Mettre à jour les autres champs
    for field in ['first_name', 'last_name', 'bio', 'profile_picture']:
        if field in data:
            setattr(user, field, data[field])
    
    # Mettre à jour le mot de passe si fourni
    if 'password' in data and data['password']:
        user.set_password(data['password'])
    
    # Sauvegarder les modifications
    db.session.commit()
    
    return jsonify({
        'message': 'Profil mis à jour avec succès',
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'bio': user.bio,
            'profile_picture': user.profile_picture,
            'role': user.role
        }
    }), 200

@users_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    users = User.query.all()
    
    users_list = [{
        'id': user.id,
        'username': user.username,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'role': user.role,
        'profile_picture': user.profile_picture
    } for user in users]
    
    return jsonify(users_list), 200

@users_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'Utilisateur non trouvé'}), 404
    
    return jsonify({
        'id': user.id,
        'username': user.username,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'bio': user.bio,
        'profile_picture': user.profile_picture,
        'role': user.role,
        'created_at': user.created_at.isoformat()
    }), 200

@users_bp.route('/users/<int:user_id>/activity', methods=['GET'])
@jwt_required()
def get_user_activity(user_id):
    current_user_id = get_current_user_id()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'Utilisateur non trouvé'}), 404
    
    # Récupérer les publications de l'utilisateur
    publications = LiteraryWork.query.filter_by(author_id=user_id).order_by(LiteraryWork.created_at.desc()).all()
    
    # Récupérer les commentaires de l'utilisateur
    comments = Comment.query.filter_by(user_id=user_id).order_by(Comment.created_at.desc()).all()
    
    # Récupérer les œuvres aimées par l'utilisateur
    liked_works = user.liked_works
    
    # Formatage de la réponse
    activity = {
        'user': {
            'id': user.id,
            'username': user.username,
            'profile_picture': user.profile_picture
        },
        'publications': [{
            'id': work.id,
            'title': work.title,
            'type': work.type,
            'status': work.status,
            'created_at': work.created_at.isoformat(),
            'likes_count': len(work.likes),
            'comments_count': len(work.comments)
        } for work in publications],
        'comments': [{
            'id': comment.id,
            'content': comment.content,
            'rating': comment.rating,
            'created_at': comment.created_at.isoformat(),
            'literary_work': {
                'id': comment.literary_work.id,
                'title': comment.literary_work.title,
                'author': comment.literary_work.author.username
            }
        } for comment in comments],
        'liked_works': [{
            'id': work.id,
            'title': work.title,
            'type': work.type,
            'author': work.author.username,
            'likes_count': len(work.likes)
        } for work in liked_works],
        'statistics': {
            'total_publications': len(publications),
            'total_comments': len(comments),
            'total_likes_given': len(liked_works),
            'total_likes_received': sum(len(work.likes) for work in publications)
        }
    }
    
    return jsonify(activity), 200 