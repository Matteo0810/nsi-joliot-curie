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
            ('user_id', self._data['owner_id']),
            ('required_permission', self._data['permission']),
            ('created_at', calendar.timegm(time.gmtime())),
            ('from_folder', self._data['from_folder']),
            ('icon', self._data['icon'])
        ])
        return Folder(result)

    @property
    def get_files(self):
        return [File(data).to_json for data in
                self.get_join(['files.file_id', 'files.name', 'file_size', 'path', 'files.folder_id',
                               'files.required_permission', 'files.created_at'],
                              'files', 'folder_id').fetchall()]

    @property
    def to_json(self):
        return {
            "id": self._data[0],
            "name": self._data[1],
            "required_permission": self._data[2],
            "user_id": self._data[3],
            "created_at": self._data[4],
            "icon": self._data[5],
            "files": self.get_files
        }

    @staticmethod
    def export_to_json(request):
        """
        @param request: SQL Request
        @return: return a folder json otherwise it returns None type
        """
        response = request.fetchone()
        if response is None:
            return None
        return Folder(response).to_json
