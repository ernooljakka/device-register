from flask import Blueprint, Response
from flask_jwt_extended import jwt_required
from backend.controllers.user_controller import get_user_by_id, get_all_users


user_api = Blueprint('user_api', __name__)


@user_api.route('/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user_by_user_id(user_id: int) -> tuple[Response, int]:
    return get_user_by_id(user_id)


@user_api.route('/', methods=['GET'])
@jwt_required()
def list_all_users() -> tuple[Response, int]:
    return get_all_users()
