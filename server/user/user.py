from enum import Enum
from content.folder import Folder

import bcrypt
import calendar
import jwt
import time

from database.database import Selector
from helpers.dotenv import get_env

TABLE_NAME = 'users'


class User(Selector):

    def __init__(self, data):
        super().__init__(TABLE_NAME)

        if isinstance(data, int):
            self._data = self.get_all([('user_id', data)]).fetchone()
            return
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
            ('surname', self._data['surname']),
            ('name', self._data['name']),
            ('password', bcrypt.hashpw(bytes(self._data['password'], 'utf-8'),
                                       bcrypt.gensalt(rounds=10)).decode('utf-8')),
            ('created_at', calendar.timegm(time.gmtime())),
            ('permission', UserPermission.DEFAULT.value)
        ])
        return User.encode(user_id)

    def get_folder(self, folder_id: int):
        """
        Getting a folder content by id
        @param folder_id: folderId (1=root folder)
        @return: list of folders
        """
        return [Folder(data).to_json for data in
                self.get_join(['folders.folder_id', 'folders.name', 'required_permission',
                               'folders.user_id', 'folders.created_at', 'folders.icon'],
                              'folders', 'user_id', [('from_folder', folder_id)]).fetchall()]

    @property
    def has_data(self):
        return self._data is not None

    @property
    def to_json(self):
        return {
            "user_id": self._data[0],
            "username": self._data[1],
            "surname": self._data[2],
            "name": self._data[3],
            "encrypted_password": self._data[4],
            "created_at": self._data[5],
            "permission": self._data[6]
        }

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

    @staticmethod
    def has_permission(data, user_id=None):
        return data['permission'] == (UserPermission.ADMIN.value or UserPermission.MOD.value) \
               or (user_id is not None and data['id'] == user_id)


class UserPermission(Enum):
    ADMIN = 3
    MOD = 2
    DEFAULT = 1
