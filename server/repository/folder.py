from builtins import property

from server.database.database import Selector
from server.repository.file import File

from helpers.utils import arr_to_dict, get_current_time

TABLE_NAME = "folders"


class Folder(Selector):

    def __init__(self, data):
        super().__init__(TABLE_NAME)

        if isinstance(data, int):
            self._folder_id = data
            self._data = self.get_all([('folder_id', data)]).fetchone()
            return
        self._data = data

    def create(self):
        """
         create a new folder
        :return: return a new instance Folder
        """
        return Folder(self.insert([
            ('parent_id', self._data['parent_id']),
            ('name', self._data['name']),
            ('permission_list', self._data['permission_list']),
            ('created_at', get_current_time()),
            ('updated_at', get_current_time()),
            ('icon', self._data['icon']),
            ('group_id', 1)
        ]))

    def delete(self, condition: list = None):
        super().delete([('folder_id', self._folder_id)])

    def update(self, selector: dict, condition: list = None):
        selector['updated_at'] = get_current_time()
        super().update(selector, [('folder_id', self._folder_id)])

    @property
    def get_folders(self):
        """
        get folders of the folder current
        :return: list of Folder data
        """
        return [Folder(data).get_infos for data in
                self.get_all([('parent_id', self._folder_id)])
                if data[0] != self._folder_id]

    @property
    def get_files(self):
        """
        get files of a folder
        :return: list of File data
        """
        return [File(data).to_json for data in
                self.get_join(File.get_selection(), 'files', 'folder_id', [('folders.folder_id', self._folder_id)])]

    @property
    def to_json(self):
        self._data += (self.get_files, self.get_folders)
        return arr_to_dict(self._data, ["folder_id", "parent_id", "name", "permission_list",
                                        "created_at", "updated_at", "icon", "group_id", "files", "folders"])

    @property
    def get_infos(self):
        return arr_to_dict(self._data, ["folder_id", "parent_id", "name", "permission_list",
                                        "created_at", "updated_at", "icon", "group_id"])

    @staticmethod
    def from_(folder_id: int):
        return Folder(int(folder_id))
