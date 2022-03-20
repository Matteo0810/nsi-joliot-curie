from server.user.user import User

from lib.router.router import Router

router = Router()


def search(request, response):
    query = request.query['query']
    return response.json({"results": ([], User.search(query))[len(query) > 1]})


def get(request, response):
    result = User.decode(request.headers.get('Authorization'))
    if isinstance(result, dict):
        return response.json(result)
    return response.json(result.to_json)


def login(request, response):
    data = request.body
    if not data or ('password' not in data or
                    'username' not in data):
        return response.json({"status": 503, "message": 'Formulare invalide.'})
    user_data = User.fetch(data['username'])
    if not user_data.has_data:
        return response.json({"status": 404, "message": 'Utilisateur introuvable.'})
    user_data = user_data.to_json
    if User.verify(data['password'], user_data['password']):
        return response.json({"token": User.encode(user_data['user_id'])})
    return response.json({"status": 403, "message": 'Mot de passe invalide.'})


def add(request, response):
    result = User.decode(request.headers.get('Authorization'))
    if not isinstance(result, dict):
        return response.json(result)
    User(request.body).create()
    return response.json({"status": 200, "message": 'Utilisateur ajouté.'})


def delete(request, response):
    user_id = request.query['user_id']
    result = User.decode(request.headers.get('Authorization'))
    if not isinstance(result, dict):
        return response.json(result)
    User(user_id).delete([('user_id', user_id)])
    return response.json({"status": 200, "message": 'Utilisateur supprimé.'})


def update(request, response):
    result = User.decode(request.headers.get('Authorization'))
    data = request.body
    if data is None or 'user_id' not in data:
        return response.json({"status": 403, "message": "user_id introuvable."})
    if not isinstance(result, dict):
        return response.json(result)
    user_id = data['user_id']
    User(user_id).update(data, [('user_id', user_id)])
    return response.json({"status": 200, "message": "Utilisateur mis à jour."})


router.get('/search', search)
router.post('/login', login)
router.post('/add', add)

router.get('/', get)
router.delete('/', delete)
router.patch('/', update)
