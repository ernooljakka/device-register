from flask import jsonify, Response
from typing import List, Dict, Tuple
from backend.models.device_model import Device


def get_devices() -> Tuple[Response, int]:
    all_devices: List[Device] = Device.get_all()
    device_list: List[Dict[str, str]] = [
        device.to_dict() for device in all_devices
    ]
    print(device_list)
    return jsonify(device_list), 200
