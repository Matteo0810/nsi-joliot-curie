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

    def create(self):
        result = self.insert([
            ('name', self._data["name"]),
            ('path', self._data["path"]),
            ('file_size', self._data["file_size"]),
            ('folder_id', self._data["folder_id"]),
            ('required_permission', self._data["permission"]),
            ('created_at', calendar.timegm(time.gmtime()))
        ])
        return File(result)

    def delete_file(self):
        print(self._data)
        self.delete([('file_id', self._data)])

    def update_file(self, data):
        self.update(data, [('file_id', self._data)])

    @property
    def to_json(self):
        print(self._data)
        return {
            "id": self._data[0],
            "name": self._data[1],
            "file_size": self._data[2],
            "path": self._data[3],
            "folder_id": self._data[4],
            "required_permission": self._data[5],
            "created_at": self._data[6]
        }
