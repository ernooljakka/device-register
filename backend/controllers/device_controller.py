from flask import jsonify, Response
from backend.models.device_model import Device


def get_devices() -> tuple[Response, int]:
    all_devices: list[Device] = Device.get_all()
    device_list: list[dict[str, str]] = [
        device.to_dict() for device in all_devices
    ]
    print(device_list)
    return jsonify(device_list), 200
