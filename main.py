from lib.application import Application
from helpers.dotenv import dotenv, get_env

import server.user.main as user
import server.repository.main as repository
import server.news.main as news

dotenv()

PORT = get_env("PORT")
app = Application()

app.define_asset('public', './public')


def start_app(error):
    if error:
        raise error
    print(f'Application listening on port {PORT}')


app.all('/', lambda _, response: response.render('./public/index'))


app.use("/user", user.router)
app.use("/repository", repository.router)
app.use('/news', news.router)

app.listen(PORT, lambda error: start_app(error))
