from flask import Blueprint, Response
from backend.controllers.device_controller import (get_devices,
                                                   create_devices,
                                                   get_device_by_id)


device_api = Blueprint('device_api', __name__)


@device_api.route('/', methods=['GET'])
def list_devices() -> tuple[Response, int]:
    return get_devices()


@device_api.route('/', methods=['POST'])
def add_devices() -> tuple[Response, int]:
    return create_devices()


@device_api.route('/<int:dev_id>', methods=['GET'])
def device_by_id(dev_id: int) -> tuple[Response, int]:
    return get_device_by_id(dev_id)
