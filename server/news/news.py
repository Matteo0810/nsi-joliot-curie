from server.database.database import Selector

from helpers.utils import arr_to_dict, get_current_time

TABLE_NAME = 'news'


class News(Selector):

    def __init__(self, data):
        super().__init__(TABLE_NAME)

        if isinstance(data, int):
            self._data = self.get_all([('news_id', data)]).fetchone()
            return
        self._data = data

    def create(self):
        """
        Create a newspaper
        @return: new instance of a News
        """
        return News(self.insert([
            ('author', self._data['author']),
            ('title', self._data['title']),
            ('content', self._data['content']),
            ('created_at', get_current_time()),
            ('updated_at', get_current_time())
        ]))

    @property
    def to_json(self):
        return arr_to_dict(self._data, ["news_id", "author", "title", "content", "created_at", "updated_at"])
