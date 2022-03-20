from server.database.database import Selector

from helpers.utils import arr_to_dict, get_current_time

TABLE_NAME = 'groups'


class Group(Selector):

    def __init__(self, data):
        super().__init__(TABLE_NAME)

        if isinstance(data, int):
            self._data = self.get_all([('group_id', data)]).fetchone()
            return
        self._data = data

    def create(self):
        """
        Create a group
        @return: new instance of a Group
        """
        return Group(self.insert([
            ('name', self._data['name']),
            ('created_at', get_current_time())
        ]))

    @property
    def to_json(self):
        return arr_to_dict(self._data, ["group_id", "name", "created_at"])

    @staticmethod
    def from_(group_id: int):
        return Group(group_id)
