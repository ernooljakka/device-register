from flask import jsonify, request, Response
from backend.models.class_model import Class


def get_all_classes() -> tuple[Response, int]:
    all_classes = Class.get_all()
    class_list: list[dict[str, str]] = [
        item.to_dict() for item in all_classes
    ]

    return jsonify(class_list), 200


def create_class() -> tuple[Response, int]:
    class_data = request.get_json()

    if not isinstance(class_data, dict):
        return jsonify({"error": "Expected a JSON object"}), 400

    class_name = class_data.get("class_name")

    if not class_name:
        return jsonify({"error": "Expected class_name"}), 400

    if not isinstance(class_name, str):
        return jsonify({"error": "Expected class_name as string"}), 400

    status_code, message = Class.create_class(class_name)

    if status_code == 201:
        return jsonify({'message': message}), status_code
    else:
        return jsonify({'error': message}), status_code


def remove_class_by_id(class_id: int) -> tuple[Response, int]:
    status_code, message = Class.remove_class_by_id(class_id)

    if status_code == 200:
        return jsonify({'message': message}), status_code
    else:
        return jsonify({'error': message}), status_code
