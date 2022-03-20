from .news import News
from server.user.user import User

from lib.router.router import Router

router = Router()


def add(request, response):
    result = User.decode(request.headers.get('Authorization'))
    if isinstance(result, dict):
        return response.json(result)
    news = News(request.body).create()
    return response.json(news.to_json)


router.post('/add', add)
