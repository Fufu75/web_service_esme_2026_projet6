from flask import Blueprint, request, jsonify
from backend.models import db, Group, User
from flask_jwt_extended import jwt_required, get_jwt_identity

groups_bp = Blueprint('groups', __name__)

@groups_bp.route('/groups', methods=['POST'])
@jwt_required()
def create_group():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Vérification des champs requis
    if not all(key in data for key in ['name', 'description']):
        return jsonify({'error': 'Tous les champs requis doivent être remplis'}), 400
    
    # Vérifier si un groupe avec le même nom existe déjà
    if Group.query.filter_by(name=data['name']).first():
        return jsonify({'error': 'Un groupe avec ce nom existe déjà'}), 400
    
    # Création du groupe
    new_group = Group(
        name=data['name'],
        description=data['description'],
        is_private=data.get('is_private', False),
        creator_id=current_user_id
    )
    
    # Sauvegarder le groupe
    db.session.add(new_group)
    db.session.commit()
    
    # Ajouter le créateur comme membre
    creator = User.query.get(current_user_id)
    new_group.members.append(creator)
    db.session.commit()
    
    return jsonify({
        'message': 'Groupe créé avec succès',
        'group': {
            'id': new_group.id,
            'name': new_group.name,
            'is_private': new_group.is_private,
            'created_at': new_group.created_at.isoformat()
        }
    }), 201

@groups_bp.route('/groups', methods=['GET'])
@jwt_required()
def get_groups():
    # Paramètres de filtrage
    creator_id = request.args.get('creator_id', type=int)
    is_private = request.args.get('is_private', type=bool)
    member_id = request.args.get('member_id', type=int)
    
    # Construction de la requête
    query = Group.query
    
    if creator_id:
        query = query.filter(Group.creator_id == creator_id)
    if is_private is not None:
        query = query.filter(Group.is_private == is_private)
    if member_id:
        query = query.filter(Group.members.any(id=member_id))
    
    # Exécution de la requête
    groups = query.all()
    
    # Formatage de la réponse
    groups_list = []
    for group in groups:
        creator = User.query.get(group.creator_id)
        group_data = {
            'id': group.id,
            'name': group.name,
            'description': group.description,
            'is_private': group.is_private,
            'created_at': group.created_at.isoformat(),
            'creator': {
                'id': creator.id,
                'username': creator.username,
                'profile_picture': creator.profile_picture
            },
            'members_count': len(group.members),
            'works_count': len(group.works)
        }
        groups_list.append(group_data)
    
    return jsonify(groups_list), 200

@groups_bp.route('/groups/<int:group_id>', methods=['GET'])
@jwt_required()
def get_group(group_id):
    current_user_id = get_jwt_identity()
    group = Group.query.get(group_id)
    
    if not group:
        return jsonify({'error': 'Groupe non trouvé'}), 404
    
    # Vérifier l'accès si le groupe est privé
    current_user = User.query.get(current_user_id)
    if group.is_private and current_user not in group.members and current_user.role != 'admin':
        return jsonify({'error': 'Vous n\'avez pas accès à ce groupe privé'}), 403
    
    creator = User.query.get(group.creator_id)
    
    # Formatage de la réponse
    group_data = {
        'id': group.id,
        'name': group.name,
        'description': group.description,
        'is_private': group.is_private,
        'created_at': group.created_at.isoformat(),
        'creator': {
            'id': creator.id,
            'username': creator.username,
            'profile_picture': creator.profile_picture
        },
        'members': [{
            'id': member.id,
            'username': member.username,
            'profile_picture': member.profile_picture
        } for member in group.members],
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
        } for work in group.works]
    }
    
    return jsonify(group_data), 200

@groups_bp.route('/groups/<int:group_id>', methods=['PUT'])
@jwt_required()
def update_group(group_id):
    current_user_id = get_jwt_identity()
    group = Group.query.get(group_id)
    
    if not group:
        return jsonify({'error': 'Groupe non trouvé'}), 404
    
    # Vérifier si l'utilisateur actuel est le créateur
    if group.creator_id != current_user_id:
        return jsonify({'error': 'Vous n\'êtes pas autorisé à modifier ce groupe'}), 403
    
    data = request.get_json()
    
    # Mise à jour des champs
    if 'name' in data and data['name'] != group.name:
        # Vérifier si un groupe avec le même nom existe déjà
        if Group.query.filter_by(name=data['name']).first():
            return jsonify({'error': 'Un groupe avec ce nom existe déjà'}), 400
        group.name = data['name']
    
    if 'description' in data:
        group.description = data['description']
    
    if 'is_private' in data:
        group.is_private = data['is_private']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Groupe mis à jour avec succès',
        'group': {
            'id': group.id,
            'name': group.name,
            'description': group.description,
            'is_private': group.is_private
        }
    }), 200

@groups_bp.route('/groups/<int:group_id>', methods=['DELETE'])
@jwt_required()
def delete_group(group_id):
    current_user_id = get_jwt_identity()
    group = Group.query.get(group_id)
    
    if not group:
        return jsonify({'error': 'Groupe non trouvé'}), 404
    
    # Vérifier si l'utilisateur actuel est le créateur ou un admin
    user = User.query.get(current_user_id)
    if group.creator_id != current_user_id and user.role != 'admin':
        return jsonify({'error': 'Vous n\'êtes pas autorisé à supprimer ce groupe'}), 403
    
    # Supprimer le groupe
    db.session.delete(group)
    db.session.commit()
    
    return jsonify({'message': 'Groupe supprimé avec succès'}), 200

@groups_bp.route('/groups/<int:group_id>/join', methods=['POST'])
@jwt_required()
def join_group(group_id):
    current_user_id = get_jwt_identity()
    group = Group.query.get(group_id)
    user = User.query.get(current_user_id)
    
    if not group or not user:
        return jsonify({'error': 'Groupe ou utilisateur non trouvé'}), 404
    
    # Vérifier si l'utilisateur est déjà membre
    if user in group.members:
        return jsonify({'error': 'Vous êtes déjà membre de ce groupe'}), 400
    
    # Vérifier si le groupe est privé
    if group.is_private:
        return jsonify({'error': 'Ce groupe est privé. Contactez le créateur pour y être ajouté'}), 403
    
    # Ajouter l'utilisateur comme membre
    group.members.append(user)
    db.session.commit()
    
    return jsonify({
        'message': 'Vous avez rejoint le groupe avec succès',
        'members_count': len(group.members)
    }), 200

@groups_bp.route('/groups/<int:group_id>/leave', methods=['POST'])
@jwt_required()
def leave_group(group_id):
    current_user_id = get_jwt_identity()
    group = Group.query.get(group_id)
    user = User.query.get(current_user_id)
    
    if not group or not user:
        return jsonify({'error': 'Groupe ou utilisateur non trouvé'}), 404
    
    # Vérifier si l'utilisateur est membre
    if user not in group.members:
        return jsonify({'error': 'Vous n\'êtes pas membre de ce groupe'}), 400
    
    # Vérifier si l'utilisateur est le créateur (ne peut pas quitter)
    if group.creator_id == current_user_id:
        return jsonify({'error': 'Le créateur ne peut pas quitter le groupe'}), 400
    
    # Retirer l'utilisateur des membres
    group.members.remove(user)
    db.session.commit()
    
    return jsonify({
        'message': 'Vous avez quitté le groupe avec succès',
        'members_count': len(group.members)
    }), 200

@groups_bp.route('/groups/<int:group_id>/add-member', methods=['POST'])
@jwt_required()
def add_member(group_id):
    current_user_id = get_jwt_identity()
    group = Group.query.get(group_id)
    
    if not group:
        return jsonify({'error': 'Groupe non trouvé'}), 404
    
    # Vérifier si l'utilisateur actuel est le créateur
    if group.creator_id != current_user_id:
        return jsonify({'error': 'Seul le créateur peut ajouter des membres'}), 403
    
    data = request.get_json()
    if 'user_id' not in data:
        return jsonify({'error': 'ID utilisateur requis'}), 400
    
    user_to_add = User.query.get(data['user_id'])
    if not user_to_add:
        return jsonify({'error': 'Utilisateur à ajouter non trouvé'}), 404
    
    # Vérifier si l'utilisateur est déjà membre
    if user_to_add in group.members:
        return jsonify({'error': 'Cet utilisateur est déjà membre du groupe'}), 400
    
    # Ajouter l'utilisateur comme membre
    group.members.append(user_to_add)
    db.session.commit()
    
    return jsonify({
        'message': 'Membre ajouté avec succès',
        'members_count': len(group.members)
    }), 200

@groups_bp.route('/groups/<int:group_id>/remove-member', methods=['POST'])
@jwt_required()
def remove_member(group_id):
    current_user_id = get_jwt_identity()
    group = Group.query.get(group_id)
    
    if not group:
        return jsonify({'error': 'Groupe non trouvé'}), 404
    
    # Vérifier si l'utilisateur actuel est le créateur
    if group.creator_id != current_user_id:
        return jsonify({'error': 'Seul le créateur peut retirer des membres'}), 403
    
    data = request.get_json()
    if 'user_id' not in data:
        return jsonify({'error': 'ID utilisateur requis'}), 400
    
    user_to_remove = User.query.get(data['user_id'])
    if not user_to_remove:
        return jsonify({'error': 'Utilisateur à retirer non trouvé'}), 404
    
    # Vérifier si l'utilisateur est membre
    if user_to_remove not in group.members:
        return jsonify({'error': 'Cet utilisateur n\'est pas membre du groupe'}), 400
    
    # Vérifier si l'utilisateur à retirer est le créateur (ne peut pas être retiré)
    if user_to_remove.id == group.creator_id:
        return jsonify({'error': 'Le créateur ne peut pas être retiré du groupe'}), 400
    
    # Retirer l'utilisateur des membres
    group.members.remove(user_to_remove)
    db.session.commit()
    
    return jsonify({
        'message': 'Membre retiré avec succès',
        'members_count': len(group.members)
    }), 200 