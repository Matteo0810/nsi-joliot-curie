from flask import Blueprint, request
from user.user import User

user = Blueprint('user', __name__)


@user.route('/get', methods=['GET'])
def get():
    result = User.decode(request.headers.get('Authorization'))
    if isinstance(result, dict):
        return result
    return result.to_json


@user.route('/login', methods=['POST'])
def login():
    data = request.json
    if not data or ('password' not in data or
                    'username' not in data):
        return {"status": 503, "message": 'Formulare invalide.'}
    user_data = User.fetch(data['username'])
    if not user_data.has_data:
        return {"status": 404, "message": 'Utilisateur introuvable.'}
    user_data = user_data.to_json
    if User.verify(data['password'], user_data['encrypted_password']):
        return {"token": User.encode(user_data['user_id'])}
    return {"status": 403, "message": 'Mot de passe invalide.'}


@user.route('/add', methods=['POST'])
def add():
    user_data = User.decode(request.headers.get('Authorization'))
    if not isinstance(user_data, dict):
        return user_data
    if User.has_permission(user_data):
        User(request.json).create()
        return {"status": 200, "message": 'Utilisateur ajouté.'}
    return {"status": 403, "message": "Vous n'avez pas la permission."}


@user.route('/delete/<user_id>', methods=['DELETE'])
def delete(user_id):
    user_data = User.decode(request.headers.get('Authorization'))
    if not isinstance(user_data, dict):
        return user_data
    if User.has_permission(user_data, user_id):
        User(user_id).delete_by_id()
        return {"status": 200, "message": 'Utilisateur supprimé.'}
    return {"status": 403, "message": "Vous n'avez pas la permission."}


@user.route('/update', methods=['PATCH'])
def update():
    user_data = User.decode(request.headers.get('Authorization'))
    data = request.json
    if data is None or 'user_id' not in data:
        return {"status": 403, "message": "user_id introuvable."}
    if not isinstance(user_data, dict):
        return user_data
    if User.has_permission(user_data, data['user_id']):
        User(data['user_id']).update_by_id(data['data'])
        return {"status": 200, "message": "Utilisateur mis à jour."}
    return {"status": 403, "message": "Vous n'avez pas la permission."}
