from flask import Blueprint, Response, request
from backend.controllers.device_controller import (
    get_devices,
    create_devices,
    get_device_by_id,
    remove_devices,
    update_device,
    get_events_by_device_id
)


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


@device_api.route('/<int:dev_id>', methods=['PATCH'])
def update_device_by_id(dev_id: int) -> tuple[Response, int]:
    device_data = request.get_json()
    return update_device(dev_id, device_data)


@device_api.route('/', methods=['DELETE'])
def delete_devices() -> tuple[Response, int]:
    return remove_devices()


@device_api.route('/<int:dev_id>/events', methods=['GET'])
def device_events_by_id(dev_id: int) -> tuple[Response, int]:
    return get_events_by_device_id(dev_id)
