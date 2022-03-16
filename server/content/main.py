import os
from flask import Blueprint, request

from user.user import User

from content.folder import Folder
from content.file import File

content = Blueprint('content', __name__)


# FOLDER PART

@content.route('/folders/add', methods=['POST'])
def add_folder():
    result = User.decode(request.headers.get('Authorization'))
    if isinstance(result, dict):
        return result
    result = Folder(request.json).create()
    return {"code": 200, "folder": result.to_json}


@content.route('/folders/get/<folder_id>', methods=['GET'])
def get_folder(folder_id: int):
    result = User.decode(request.headers.get('Authorization'))
    if isinstance(result, dict):
        return result
    return result.get_folder(folder_id)


# FILES PART

@content.route('/files/add', methods=['POST'])
def add_files():
    files = []
    for name, file in request.files.items():
        isImage = name.split('.').pop() in ["png", "jpg", "gif", "wepb", "jfif"]
        directory = ("documents", "images")[isImage]
        try:
            file_path = os.path.join(f'.\\static\\{directory}', name)
            with open(file_path, 'wb') as temp_file:
                temp_file.write(file.read())
            path = f'http://127.0.0.1:1500/static/{directory}/{name}'
            result = File({"name": name, "file_size": os.stat(file_path).st_size,
                           "path": path, "folder_id": 1, "permission": "0,0,0"}) \
                .create()
            files.append(result.to_json)
        except RuntimeError:
            return {"code": 500, "message": "Erreur interne."}
    return {"code": 200, "files": files}


@content.route('/files/delete/<file_id>', methods=['DELETE'])
def delete_file(file_id: str):
    result = User.decode(request.headers.get('Authorization'))
    if isinstance(result, dict):
        return result
    try:
        File(file_id).delete_file()
        return {"code": 200, "message": "Fichier supprimé."}
    except RuntimeError:
        return {"code": 500, "message": "Erreur interne."}


# SEARCH

@content.route('/search/<query>', methods=['GET'])
def search(query: str):
    if len(query) < 1:
        return {"result": []}
    return {"results": User.search(query)}
