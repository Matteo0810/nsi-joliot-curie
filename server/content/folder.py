from database.database import Selector
from content.file import File

import calendar
import time


class Folder(Selector):

    def __init__(self, data):
        super().__init__('folders')

        if isinstance(data, int):
            self._data = self.get_all([('folder_id', data)]).fetchone()
            return
        self._data = data

    def create(self):
        result = self.insert([
            ('name', self._data['name']),
            ('owner_id', self._data['owner_id']),
            ('required_permission', self._data['permission']),
            ('created_at', calendar.timegm(time.gmtime())),
            ('icon', self._data['icon'])
        ])
        return Folder(result)

    @property
    def get_files(self):
        return [File(data).to_json for data in
                self.get_join(['files.file_id', 'files.name', 'path', 'files.folder_id',
                               'files.required_permission', 'files.created_at'],
                              'files', 'folder_id').fetchall()]

    @property
    def to_json(self):
        return {
            "id": self._data[0],
            "name": self._data[1],
            "user_id": self._data[2],
            "required_permission": self._data[3],
            "created_at": self._data[4],
            "files": self.get_files
        }
