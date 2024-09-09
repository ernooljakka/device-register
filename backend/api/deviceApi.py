from flask import Blueprint
from backend.controllers.deviceController import get_devices

device_api = Blueprint('device_api', __name__)

@device_api.route('/', methods=['GET'])
def list_devices():
    return get_devices()