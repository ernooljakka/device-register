from flask import Blueprint, Response
from backend.controllers.device_controller import get_devices

device_api = Blueprint('device_api', __name__)


@device_api.route('/', methods=['GET'])
def list_devices() -> tuple[Response, int]:
    return get_devices()
