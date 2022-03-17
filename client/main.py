from flask import Flask, render_template
from helpers.dotenv import dotenv, get_env

dotenv()
app = Flask(__name__)


@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(port=get_env('PORT'))
 