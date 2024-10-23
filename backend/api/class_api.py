from flask import Blueprint, Response
from backend.controllers.class_controller import (
    get_all_classes,
    create_class,
    remove_class_by_id
)


class_api: Blueprint = Blueprint('class_api', __name__)


@class_api.route('/', methods=['GET'])
def list_classes() -> tuple[Response, int]:
    return get_all_classes()


@class_api.route('/', methods=['POST'])
def add_class() -> tuple[Response, int]:
    return create_class()


@class_api.route('/<int:dev_id>', methods=['DELETE'])
def delete_class(dev_id: int) -> tuple[Response, int]:
    return remove_class_by_id(dev_id)
