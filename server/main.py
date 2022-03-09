from flask import Flask
from helpers.dotenv import dotenv, get_env

from user.main import user
from content.main import content

dotenv()
app = Flask(__name__)


app.register_blueprint(user, url_prefix='/user')
app.register_blueprint(content, url_prefix='/content')


# enable CORS just for port 3000
@app.after_request
def after_request(response):
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS, PUT, DELETE"
    response.headers["Access-Control-Allow-Headers"] = "Accept, Content-Type, Content-Length, Accept-Encoding, " \
                                                       "X-CSRF-Token, Authorization "
    return response


if __name__ == '__main__':
    app.run(port=get_env('PORT'))
