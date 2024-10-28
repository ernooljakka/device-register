from werkzeug.security import generate_password_hash

from backend.utils.config import config


def get_admin_credentials() -> tuple[str, str]:
    admin_username = config.ADMIN_USERNAME
    admin_password = config.ADMIN_PASSWORD

    admin_password_hash = generate_password_hash(admin_password)

    return admin_username, admin_password_hash
