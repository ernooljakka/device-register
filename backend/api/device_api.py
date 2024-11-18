from flask import Blueprint, Response, request
from flask_jwt_extended import jwt_required
from backend.app import limiter
from backend.controllers.device_controller import (
    get_devices,
    create_devices,
    get_device_by_id,
    remove_devices,
    update_device,
    get_events_by_device_id,
    current_locations,
    handle_device_csv
)
from backend.utils.config import config

device_api = Blueprint('device_api', __name__)


@device_api.route('/', methods=['GET'])
@jwt_required(optional=True)
def list_devices() -> tuple[Response, int]:
    return get_devices()


@device_api.route('/', methods=['POST'])
@jwt_required(optional=True)
@limiter.limit(config.RATE_LIMIT_POSTING)
def add_devices() -> tuple[Response, int]:
    return create_devices()


@device_api.route('/<int:dev_id>', methods=['GET'])
@jwt_required(optional=True)
def device_by_id(dev_id: int) -> tuple[Response, int]:
    return get_device_by_id(dev_id)


@device_api.route('/<int:dev_id>', methods=['PATCH'])
@jwt_required()
def update_device_by_id(dev_id: int) -> tuple[Response, int]:
    device_data = request.get_json()
    return update_device(dev_id, device_data)


@device_api.route('/', methods=['DELETE'])
@jwt_required()
def delete_devices() -> tuple[Response, int]:
    return remove_devices()


@device_api.route('/<int:dev_id>/events', methods=['GET'])
@jwt_required(optional=True)
def device_events_by_id(dev_id: int) -> tuple[Response, int]:
    return get_events_by_device_id(dev_id)


@device_api.route('/current_locations/', methods=['GET'])
@jwt_required(optional=True)
def get_all_devices_current_location() -> tuple[Response, int]:
    return current_locations()


@device_api.route('/import/', methods=['POST'])
@jwt_required()
def device_import_from_csv() -> tuple[Response, int]:
    return handle_device_csv()
