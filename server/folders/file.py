from database.database import Selector

import calendar
import time


class File(Selector):

    def __init__(self, data):
        super().__init__('files')

        if isinstance(data, int):
            self._data = self.get_all([('file_id', data)]).fetchone()
            return
        self._data = data

    def create(self, name: str, path: str, folder_id: int):
        return self.insert([
            ('name', name),
            ('path', path),
            ('folder_id', folder_id),
            ('required_permission', 0),
            ('created_at', calendar.timegm(time.gmtime()))
        ])

    @property
    def to_json(self):
        return {
            "name": self._data[0],
            "path": self._data[1],
            "folder_id": self._data[2],
            "required_permission": self._data[3],
            "created_at": self._data[4]
        }