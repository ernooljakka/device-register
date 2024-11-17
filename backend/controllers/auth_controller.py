from datetime import timedelta
from flask import jsonify, request, Response
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash
from backend.utils.config import config
from backend.utils.check_admin import it_is_admin, get_admin_credentials


def admin_login() -> tuple[Response, int]:
    request_json = request.get_json()

    if not all(key in request_json for key in ('username', 'password')):
        return jsonify({'error': "Log in with username and password"}), 400

    request_username = request_json.get('username')
    request_password = request_json.get('password')

    admin_username, admin_pw_hash = get_admin_credentials()

    if (request_username == admin_username
            and check_password_hash(admin_pw_hash, request_password)):
        access_token = create_access_token(identity=request_username,
                                           expires_delta=timedelta(
                                               hours=config.JWT_EXPIRY_HOURS))
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({'error': 'Bad username or password'}), 401


def is_admin() -> tuple[Response, int]:
    if it_is_admin():
        return jsonify({'msg': 'Authorized'}), 200
    else:
        return jsonify({'error': 'Unauthorized'}), 403
