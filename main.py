from lib.application import Application
from helpers.dotenv import dotenv, get_env

dotenv()

PORT=get_env("SERVER_PORT")
app = Application()

def start_app(error):
    if error: raise error
    print(f'Application listening on port {PORT}')
    


app.listen(PORT, lambda error: start_app(error))