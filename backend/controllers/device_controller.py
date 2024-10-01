from flask import jsonify, request, Response
from backend.models.device_model import Device


def get_devices() -> tuple[Response, int]:
    all_devices: list[Device] = Device.get_all()
    device_list: list[dict[str, str]] = [
        device.to_dict() for device in all_devices
    ]
    print(device_list)
    return jsonify(device_list), 200


def create_devices() -> tuple[Response, int]:
    device_json = request.get_json()

    if not isinstance(device_json, list):
        return jsonify({'error': "Expected a list of devices"}), 400

    device_list = []
    for item in device_json:
        if not all(key in item for key in ('name', 'manufacturer', 'model',
                                           'class', 'comments')):
            return (jsonify({'error': "All devices must have"
                                      " name,"
                                      " manufacturer,"
                                      " model,"
                                      " class and comments"}),
                    400)

        new_device = Device(dev_name=item['name'],
                            dev_manufacturer=item['manufacturer'],
                            dev_model=item['model'],
                            dev_class=item['class'],
                            dev_comments=item['comments'])

        device_list.append(new_device)

    database_response = Device.create_devices(device_list)
    if database_response[0]:
        return jsonify({'message': "Devices created successfully"}), 201
    else:
        return jsonify({'error': f"Database error: {database_response[1]}"}), 500


def get_device_by_id(dev_id: int) -> tuple[Response, int]:
    device: Device | None = Device.get_device_by_id(dev_id)
    if device:
        return jsonify(device.to_dict()), 200
    return jsonify({'error': 'Device not found'}), 404
