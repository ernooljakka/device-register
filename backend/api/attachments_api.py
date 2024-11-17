from flask import Blueprint, Response
from flask_jwt_extended import jwt_required
from backend.app import limiter
from backend.controllers.attachments_controller import (
    upload_files,
    list_files,
    remove_file
)
from backend.utils.config import config

attachments_api = Blueprint('attachments_api', __name__)


@attachments_api.route('/upload/<dev_id>', methods=['POST'])
@jwt_required(optional=True)
@limiter.limit(config.RATE_LIMIT_POSTING)
def send_files(dev_id: int) -> tuple[Response, int]:
    return upload_files(dev_id)


@attachments_api.route('/list/<dev_id>', methods=['GET'])
@jwt_required(optional=True)
def get_files(dev_id: int) -> tuple[Response, int]:
    return list_files(dev_id)


@attachments_api.route('/delete/<dev_id>/<file_name>', methods=['DELETE'])
@jwt_required(optional=True)
def delete_file(dev_id: int, file_name: str) -> tuple[Response, int]:
    return remove_file(dev_id, file_name)
