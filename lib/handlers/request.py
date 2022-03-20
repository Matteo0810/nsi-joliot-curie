import json


class Request:

    def __init__(self, data):
        """
            Permet de récupérer les informations d'une requête
            data: BaseHTTPRequestHandler, les informations de la requête
        """
        self.data = data
        self.headers = data.headers
        self.path: str = data.path
        self.request_type: str = data.command
        self.server_address: str = data.client_address
        self.server_version: str = data.server_version
        self.protocol_version: str = data.protocol_version

        self.query = self._parse_query()
        self.body = self._parse_body()

    def _parse_body(self):
        content_length = self.get('Content-Length')
        result = {}

        if content_length:
            body = self.data.rfile.read(int(content_length))
            if body:
                body = body.decode('utf8').replace("'", '"')
                result = json.loads(body)
        return result

    def _parse_query(self):
        chars = self.path.split('?')
        if len(chars) < 2:
            return {}
        chars = chars.pop().split('&')
        queries = {}
        for char in chars:
            char = char.split('=')
            queries[char[0]] = char[1]
        return queries

    def get(self, value) -> str:
        return self.headers.get(value)

    def accepts(self) -> str:
        return self.headers.get('accept')
