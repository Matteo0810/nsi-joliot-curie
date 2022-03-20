import os

from server.user.user import User

from .folder import Folder
from .file import File

from lib.router.router import Router

router = Router()

# folder part
FOLDER = "folder"


def add_folder(request, response):
    result = User.decode(request.headers.get('Authorization'))
    if isinstance(result, dict):
        return response.json(result)
    folder = Folder(request.body).create()
    return response.json({"code": 200, "folder": folder.to_json})


def get_folder(request, response):
    result = User.decode(request.headers.get('Authorization'))
    if isinstance(result, dict):
        return response.json(result)
    return response.json(Folder.from_(request.query['folder_id']).to_json)


def update_folder(request, response):
    result = User.decode(request.headers.get('Authorization'))
    if isinstance(result, dict):
        return response.json(result)
    body = request.body
    Folder.from_(body['folder_id']).update(body['data'])
    return response.json({"code": 200, "message": "Dossier mis à jour."})


def delete_folder(request, response):
    result = User.decode(request.headers.get('Authorization'))
    if isinstance(result, dict):
        return response.json(result)
    Folder.from_(request.query['folder_id']).delete()
    return response.json({"code": 200, "message": "Dossier supprimé."})


router.post(f'/{FOLDER}/add', add_folder)
router.get(f'/{FOLDER}/get', get_folder)
router.patch(f'/{FOLDER}/update', update_folder)
router.delete(f'/{FOLDER}/delete', delete_folder)

# file part
FILE = "file"


def add_files(request, response):
    files = []
    print(request.files)
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
            return response.json({"code": 500, "message": "Erreur interne."})
    return response.json({"code": 200, "files": files})


def update_file(request, response):
    result = User.decode(request.headers.get('Authorization'))
    if isinstance(result, dict):
        return response.json(result)
    body = request.body
    Folder.from_(body['file_id']).update(body['data'])
    return response.json({"code": 200, "message": "Fichier mis à jour."})


def delete_file(request, response):
    file_id = request.query['file_id']
    result = User.decode(request.headers.get('Authorization'))
    if isinstance(result, dict):
        return response.json(result)
    try:
        File(file_id).delete()
        return response.json({"code": 200, "message": "Fichier supprimé."})
    except RuntimeError:
        return response.json({"code": 500, "message": "Erreur interne."})


router.post(f'/{FILE}/add', add_files)
router.patch(f'/{FILE}/update', update_file)
router.delete(f'/{FILE}/delete', delete_file)
