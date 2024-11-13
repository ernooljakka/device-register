from flask import Blueprint, Response
from backend.controllers.attachments_controller import (
    upload_files,
    list_files,
    remove_file
)


attachments_api = Blueprint('attachments_api', __name__)


@attachments_api.route('/upload/<dev_id>', methods=['POST'])
def send_files(dev_id: int) -> tuple[Response, int]:
    return upload_files(dev_id)


@attachments_api.route('/list/<dev_id>', methods=['GET'])
def get_files(dev_id: int) -> tuple[Response, int]:
    return list_files(dev_id)


@attachments_api.route('/delete/<dev_id>/<file_name>', methods=['DELETE'])
def delete_file(dev_id: int, file_name: str) -> tuple[Response, int]:
    return remove_file(dev_id, file_name)
