import os
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash

load_dotenv()


def get_admin_credentials() -> tuple[str, str]:
    admin_username = os.getenv('ADMIN_USERNAME')
    admin_password = os.getenv('ADMIN_PASSWORD')

    admin_password_hash = generate_password_hash(admin_password)

    return admin_username, admin_password_hash
