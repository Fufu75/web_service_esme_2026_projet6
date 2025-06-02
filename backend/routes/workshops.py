from flask import Blueprint, request, jsonify
from models import db, Workshop, User
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

workshops_bp = Blueprint('workshops', __name__)

def get_current_user_id():
    """Utilitaire pour obtenir l'ID utilisateur actuel depuis le JWT"""
    return int(get_jwt_identity())

@workshops_bp.route('/workshops', methods=['POST'])
@jwt_required()
def create_workshop():
    current_user_id = get_current_user_id()
    data = request.get_json()
    
    # Vérification des champs requis
    if not all(key in data for key in ['title', 'description', 'theme']):
        return jsonify({'error': 'Tous les champs requis doivent être remplis'}), 400
    
    # Création de l'atelier
    new_workshop = Workshop(
        title=data['title'],
        description=data['description'],
        theme=data['theme'],
        status=data.get('status', 'planning'),
        creator_id=current_user_id
    )
    
    # Conversion des dates si fournies
    if 'start_date' in data and data['start_date']:
        try:
            new_workshop.start_date = datetime.fromisoformat(data['start_date'].replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': 'Format de date de début invalide'}), 400
    
    if 'end_date' in data and data['end_date']:
        try:
            new_workshop.end_date = datetime.fromisoformat(data['end_date'].replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': 'Format de date de fin invalide'}), 400
    
    # Sauvegarder l'atelier
    db.session.add(new_workshop)
    db.session.commit()
    
    # Ajouter le créateur comme participant
    creator = User.query.get(current_user_id)
    new_workshop.participants.append(creator)
    db.session.commit()
    
    return jsonify({
        'message': 'Atelier créé avec succès',
        'workshop': {
            'id': new_workshop.id,
            'title': new_workshop.title,
            'theme': new_workshop.theme,
            'status': new_workshop.status,
            'created_at': new_workshop.created_at.isoformat()
        }
    }), 201

@workshops_bp.route('/workshops', methods=['GET'])
def get_workshops():
    # Paramètres de filtrage
    creator_id = request.args.get('creator_id', type=int)
    status = request.args.get('status')
    theme = request.args.get('theme')
    participant_id = request.args.get('participant_id', type=int)
    
    # Construction de la requête
    query = Workshop.query
    
    if creator_id:
        query = query.filter(Workshop.creator_id == creator_id)
    if status:
        query = query.filter(Workshop.status == status)
    if theme:
        query = query.filter(Workshop.theme == theme)
    if participant_id:
        query = query.filter(Workshop.participants.any(id=participant_id))
    
    # Trier par date de création (du plus récent au plus ancien)
    query = query.order_by(Workshop.created_at.desc())
    
    # Exécution de la requête
    workshops = query.all()
    
    # Formatage de la réponse
    workshops_list = []
    for workshop in workshops:
        creator = User.query.get(workshop.creator_id)
        workshop_data = {
            'id': workshop.id,
            'title': workshop.title,
            'description': workshop.description,
            'theme': workshop.theme,
            'status': workshop.status,
            'start_date': workshop.start_date.isoformat() if workshop.start_date else None,
            'end_date': workshop.end_date.isoformat() if workshop.end_date else None,
            'created_at': workshop.created_at.isoformat(),
            'creator': {
                'id': creator.id,
                'username': creator.username,
                'profile_picture': creator.profile_picture
            },
            'participants_count': len(workshop.participants)
        }
        workshops_list.append(workshop_data)
    
    return jsonify(workshops_list), 200

@workshops_bp.route('/workshops/<int:workshop_id>', methods=['GET'])
def get_workshop(workshop_id):
    workshop = Workshop.query.get(workshop_id)
    
    if not workshop:
        return jsonify({'error': 'Atelier non trouvé'}), 404
    
    creator = User.query.get(workshop.creator_id)
    
    # Formatage de la réponse
    workshop_data = {
        'id': workshop.id,
        'title': workshop.title,
        'description': workshop.description,
        'theme': workshop.theme,
        'status': workshop.status,
        'start_date': workshop.start_date.isoformat() if workshop.start_date else None,
        'end_date': workshop.end_date.isoformat() if workshop.end_date else None,
        'created_at': workshop.created_at.isoformat(),
        'creator': {
            'id': creator.id,
            'username': creator.username,
            'profile_picture': creator.profile_picture
        },
        'participants': [{
            'id': participant.id,
            'username': participant.username,
            'profile_picture': participant.profile_picture
        } for participant in workshop.participants],
        'works': [{
            'id': work.id,
            'title': work.title,
            'type': work.type,
            'status': work.status,
            'created_at': work.created_at.isoformat(),
            'author': {
                'id': work.author.id,
                'username': work.author.username
            }
        } for work in workshop.works]
    }
    
    return jsonify(workshop_data), 200

@workshops_bp.route('/workshops/<int:workshop_id>', methods=['PUT'])
@jwt_required()
def update_workshop(workshop_id):
    current_user_id = get_current_user_id()
    workshop = Workshop.query.get(workshop_id)
    
    if not workshop:
        return jsonify({'error': 'Atelier non trouvé'}), 404
    
    # Vérifier si l'utilisateur actuel est le créateur
    if workshop.creator_id != current_user_id:
        return jsonify({'error': 'Vous n\'êtes pas autorisé à modifier cet atelier'}), 403
    
    data = request.get_json()
    
    # Mise à jour des champs
    if 'title' in data:
        workshop.title = data['title']
    if 'description' in data:
        workshop.description = data['description']
    if 'theme' in data:
        workshop.theme = data['theme']
    if 'status' in data:
        workshop.status = data['status']
    
    # Conversion des dates si fournies
    if 'start_date' in data and data['start_date']:
        try:
            workshop.start_date = datetime.fromisoformat(data['start_date'].replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': 'Format de date de début invalide'}), 400
    
    if 'end_date' in data and data['end_date']:
        try:
            workshop.end_date = datetime.fromisoformat(data['end_date'].replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': 'Format de date de fin invalide'}), 400
    
    db.session.commit()
    
    return jsonify({
        'message': 'Atelier mis à jour avec succès',
        'workshop': {
            'id': workshop.id,
            'title': workshop.title,
            'theme': workshop.theme,
            'status': workshop.status
        }
    }), 200

@workshops_bp.route('/workshops/<int:workshop_id>', methods=['DELETE'])
@jwt_required()
def delete_workshop(workshop_id):
    current_user_id = get_current_user_id()
    workshop = Workshop.query.get(workshop_id)
    
    if not workshop:
        return jsonify({'error': 'Atelier non trouvé'}), 404
    
    # Vérifier si l'utilisateur actuel est le créateur ou un admin
    user = User.query.get(current_user_id)
    if workshop.creator_id != current_user_id and user.role != 'admin':
        return jsonify({'error': 'Vous n\'êtes pas autorisé à supprimer cet atelier'}), 403
    
    # Supprimer l'atelier
    db.session.delete(workshop)
    db.session.commit()
    
    return jsonify({'message': 'Atelier supprimé avec succès'}), 200

@workshops_bp.route('/workshops/<int:workshop_id>/join', methods=['POST'])
@jwt_required()
def join_workshop(workshop_id):
    current_user_id = get_current_user_id()
    workshop = Workshop.query.get(workshop_id)
    user = User.query.get(current_user_id)
    
    if not workshop or not user:
        return jsonify({'error': 'Atelier ou utilisateur non trouvé'}), 404
    
    # Vérifier si l'utilisateur est déjà participant
    if user in workshop.participants:
        return jsonify({'error': 'Vous êtes déjà participant à cet atelier'}), 400
    
    # Ajouter l'utilisateur comme participant
    workshop.participants.append(user)
    db.session.commit()
    
    return jsonify({
        'message': 'Vous avez rejoint l\'atelier avec succès',
        'participants_count': len(workshop.participants)
    }), 200

@workshops_bp.route('/workshops/<int:workshop_id>/leave', methods=['POST'])
@jwt_required()
def leave_workshop(workshop_id):
    current_user_id = get_current_user_id()
    workshop = Workshop.query.get(workshop_id)
    user = User.query.get(current_user_id)
    
    if not workshop or not user:
        return jsonify({'error': 'Atelier ou utilisateur non trouvé'}), 404
    
    # Vérifier si l'utilisateur est participant
    if user not in workshop.participants:
        return jsonify({'error': 'Vous n\'êtes pas participant à cet atelier'}), 400
    
    # Vérifier si l'utilisateur est le créateur (ne peut pas quitter)
    if workshop.creator_id == current_user_id:
        return jsonify({'error': 'Le créateur ne peut pas quitter l\'atelier'}), 400
    
    # Retirer l'utilisateur des participants
    workshop.participants.remove(user)
    db.session.commit()
    
    return jsonify({
        'message': 'Vous avez quitté l\'atelier avec succès',
        'participants_count': len(workshop.participants)
    }), 200 