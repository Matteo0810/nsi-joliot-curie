from database.database import Selector
from folders.file import File

import calendar
import time


class Folder(Selector):

    def __init__(self, data):
        super().__init__('folders')

        if isinstance(data, int):
            self._data = self.get_all([('folder_id', data)]).fetchone()
            return
        self._data = data

    def create(self, name: str, owner_id: int):
        return self.insert([
            ('name', name),
            ('owner_id', owner_id),
            ('required_permission', 0),
            ('created_at', calendar.timegm(time.gmtime()))
        ])

    @property
    def get_files(self):
        return [File(data).to_json for data in
                self.get_join(['files.name', 'path', 'files.folder_id',
                               'files.required_permission', 'files.created_at'],
                              'files', 'folder_id').fetchall()]

    @property
    def to_json(self):
        return {
            "id": self._data[0],
            "name": self._data[1],
            "user_id": self._data[2],
            "required_permission": self._data[3],
            "created_at": self._data[4]
        }
