from server.database.database import Selector

from helpers.utils import arr_to_dict, get_current_time

TABLE_NAME = "files"


class File(Selector):

    def __init__(self, data):
        super().__init__(TABLE_NAME)

        if isinstance(data, int):
            self._data = self.get_all([('file_id', data)]).fetchone()
            return
        self._data = data

    def create(self):
        """
        to create a file
        :return: return a new instance of a File
        """
        return File(self.insert([
            ('file_size', self._data["file_size"]),
            ('folder_id', self._data["folder_id"]),
            ('name', self._data["name"]),
            ('path', self._data["path"]),
            ('permission_list', self._data["permission_list"]),
            ('created_at', get_current_time()),
            ('updated_at', get_current_time()),
            ('group_id', 1)
        ]))

    def delete(self, condition: list = None):
        super().delete([('file_id', self._data)])

    def update(self, selector: dict, condition: list = None):
        selector['updated_at'] = get_current_time()
        super().update(selector, [('file_id', self._data)])

    @property
    def to_json(self):
        return arr_to_dict(self._data,
                           ['file_id', 'file_size', 'folder_id', 'name',
                            'path', 'permission_list', 'created_at', 'updated_at', "group_id"])

    @staticmethod
    def get_selection():
        return ['file_id', 'file_size', 'files.folder_id', 'files.name', 'path',
                           'files.permission_list', 'files.created_at', 'files.updated_at', 'files.group_id']
