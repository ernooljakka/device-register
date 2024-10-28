from flask import Blueprint, Response
from backend.controllers.auth_controller import admin_login, is_admin


auth_api = Blueprint('auth_api', __name__)


@auth_api.route('/login', methods=['POST'])
def login() -> tuple[Response, int]:
    return admin_login()


@auth_api.route('/admin', methods=['GET'])
def admin_check() -> tuple[Response, int]:
    return is_admin()
