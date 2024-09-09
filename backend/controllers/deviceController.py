from flask import jsonify
from backend.models.deviceModel import Device


def get_devices():
    all_devices = Device.get_all()
    device_list = [device.to_dict() for device in all_devices]
    print(device_list)
    return jsonify(device_list), 200