from flask_jwt_extended import get_jwt_identity
from werkzeug.security import generate_password_hash
from backend.utils.config import config


def get_admin_credentials() -> tuple[str, str]:
    admin_username = config.ADMIN_USERNAME
    admin_password = config.ADMIN_PASSWORD

    admin_password_hash = generate_password_hash(admin_password)

    return admin_username, admin_password_hash


def it_is_admin():
    request_username = get_jwt_identity()
    admin_username = get_admin_credentials()[0]

    if request_username == admin_username:
        return True
    else:
        return False
