from typing import Union

from flask import jsonify, Response
from backend.models.user_model import User


def get_user_by_id(user_id: int) -> tuple[Response, int]:
    user: Union[User, None] = User.get_user_by_id(user_id)
    if user:
        return jsonify(user.to_dict()), 200
    return jsonify({'error': 'User not found'}), 404


def add_or_update_user(user_data: dict[str, Union[str, int]]) -> tuple[Response, int]:
    try:
        updated_user, created = User.add_or_update_user(user_data)

        if created:
            status_code = 201  # new user created
        else:
            status_code = 200  # existing user updated

        return jsonify(updated_user.to_dict()), status_code
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'An unexpected error occurred: ' + str(e)}), 500


def get_all_users() -> tuple[Response, int]:
    users: list[User] = User.get_all()
    user_list: list[dict[str, str]] = [user.to_dict() for user in users]
    return jsonify(user_list), 200
