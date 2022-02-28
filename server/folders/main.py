from flask import Blueprint, request
from user.user import User

folders = Blueprint('folders', __name__)


@folders.route('/get/<folder_id>', methods=['GET'])
def get_folders(folder_id):
    result = User.decode(request.headers.get('Authorization'))
    if isinstance(result, dict):
        return result
    return {"folders": result.get_folders(folder_id)}
