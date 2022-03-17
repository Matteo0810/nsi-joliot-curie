import os


from lib.router.router import Router
from user.user import User

from content.folder import Folder
from content.file import File

router = Router("/content")

# FOLDER PART

def add_folder(request, response):
    result = User.decode(request.headers.get('Authorization'))
    if isinstance(result, dict):
        return result
    result = Folder(request.body).create()
    return response.json({"code": 200, "folder": result.to_json})
router.post('/folders/add', add_folder)   


def get_folder(request, response):
    result = User.decode(request.headers.get('Authorization'))
    if isinstance(result, dict):
        return result
    folder_id = request.query
    response.json(result.get_folder(folder_id))
router.get('/folders/get', get_folder)

# FILES PART

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

router.post('/files/add', add_files)


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
