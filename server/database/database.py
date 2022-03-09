import sqlite3

connection = sqlite3.connect('./database/api.db', check_same_thread=False)


class Selector:

    def __init__(self, table: str):
        global connection
        self._connection = connection

        self._table = table
        self._cursor = self._connection.cursor()

    def get_all(self, condition: list = None):
        return self.get(['*'], condition)

    def get_like(self, query: str, condition: list = None):
        return self.request(f'SELECT * FROM {self._table} '
                            f'WHERE surname LIKE \'{query}%\' OR name LIKE \'{query}%\' ', condition)

    def get_join(self, selector: list, other_table: str, selector_id: str, condition: list = None):
        return self.request(f'SELECT {",".join(selector)} FROM {self._table}'
                            f' JOIN {other_table} ON '
                            f'{self._table}.{selector_id} = {other_table}.{selector_id}', condition)

    def get(self, selector: list, condition: list = None):
        return self.request(f'SELECT {",".join(selector)} FROM {self._table}', condition)

    def delete(self, condition: list = None):
        self.request(f'DELETE FROM {self._table}', condition)
        self._connection.commit()

    def update(self, selector: list, condition: list = None):
        self.request(f'UPDATE {self._table} SET {self._parse(selector, ",")}', condition)
        self._connection.commit()

    def insert(self, selector: list):
        keys = list(map(lambda value: value[0], selector))
        values = list(map(lambda value: f'\'{value[1]}\'', selector))
        self.request(f'INSERT INTO {self._table} ({",".join(keys)}) VALUES ({",".join(values)})')
        self._connection.commit()
        return self._cursor.lastrowid

    def request(self, selector: str, condition: list = None):
        condition = " WHERE " + self._parse(condition) if condition else ""
        return self._cursor.execute(selector + condition)

    def _parse(self, selector: list, separator=" AND "):
        return separator.join(list(map(lambda entries: f'{entries[0]} = \'{entries[1]}\'', selector)))
