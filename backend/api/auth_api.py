from flask import Blueprint, Response
from flask_jwt_extended import jwt_required
from backend.controllers.auth_controller import admin_login, is_admin


auth_api = Blueprint('auth_api', __name__)


@auth_api.route('/login', methods=['POST'])
@jwt_required(optional=True)
def login() -> tuple[Response, int]:
    return admin_login()


@auth_api.route('/admin', methods=['GET'])
@jwt_required()
def admin_check() -> tuple[Response, int]:
    return is_admin()
