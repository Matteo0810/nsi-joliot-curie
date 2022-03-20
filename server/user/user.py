from enum import Enum

import bcrypt
import calendar
import jwt
import time

from server.database.database import Selector
from .group import Group

from helpers.dotenv import get_env
from helpers.utils import arr_to_dict

TABLE_NAME = 'users'


class User(Selector):

    def __init__(self, data):
        super().__init__(TABLE_NAME)

        if isinstance(data, int):
            self._data = self.get_all([('user_id', data)]).fetchone()
        elif isinstance(data, str):
            self._data = self.get_all([('username', data)]).fetchone()
        else:
            self._data = data

    def create(self):
        """
        Create user account
        @return: encoded user id
        """
        user_id = self.insert([
            ('username', f'{self._data["surname"]}.{self._data["name"]}'),
            ('name', self._data['name']),
            ('surname', self._data['surname']),
            ('password', bcrypt.hashpw(bytes(self._data['password'], 'utf-8'),
                                       bcrypt.gensalt(rounds=10)).decode('utf-8')),
            ('created_at', calendar.timegm(time.gmtime())),
            ('group_id', 1), # TODO has to be changed
            ('permission', UserPermission.DEFAULT.value)
        ])
        return User.encode(user_id)

    @property
    def has_data(self):
        return self._data is not None

    @property
    def to_json(self):
        result = arr_to_dict(self._data,
                           ["user_id", "username", "name", "surname", "password",
                            "created_at", "group", "permission"])
        result['group'] = Group.from_(result['group']).to_json
        return result

    @staticmethod
    def search(query: str):
        return [User.fetch(data).to_json for data in Selector(TABLE_NAME).get_like(query).fetchmany()]

    @staticmethod
    def fetch(user_data: object):
        return User(user_data)

    @staticmethod
    def encode(user_id: int):
        return jwt.encode({'id': user_id}, get_env('SECRET'), algorithm='HS256')

    @staticmethod
    def decode(authorization: str):
        if authorization is None:
            return {"status": 404, "message": 'Jeton introuvable.'}
        authorization = authorization.split(' ').pop()
        try:
            payload = jwt.decode(authorization, get_env('SECRET'), algorithms=['HS256'])
            user = User(payload['id'])
            if user.has_data:
                return user
            return {"status": 403, "message": 'Jeton invalide.'}
        except jwt.DecodeError:
            return {"status": 403, "message": 'Impossible de décoder le jeton.'}

    @staticmethod
    def verify(password: str, hashed_password: str):
        hashed_password = bytes(hashed_password, 'utf-8')
        password = bytes(password, 'utf-8')
        return bcrypt.checkpw(password, hashed_password)


class UserPermission(Enum):
    ADMIN = 3
    MOD = 2
    DEFAULT = 1
