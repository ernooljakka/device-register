import csv
import io
from typing import Union, Optional

from datetime import datetime, timezone
from flask import jsonify, request, Response
from backend.controllers.attachments_controller import remove_attachments
from backend.controllers.class_controller import get_class_dict
from backend.controllers.event_controller import create_event
from backend.models.device_model import Device
from backend.utils.qr_generator import generate_qr, remove_qr
from backend.utils.check_admin import it_is_admin


def get_devices() -> tuple[Response, int]:
    all_devices: list[Device] = Device.get_all()
    device_list: list[dict[str, str]] = [
        device.to_dict() for device in all_devices
    ]

    return jsonify(device_list), 200


def create_devices(device_data=None) -> tuple[Response, int]:
    if not device_data:
        device_data = request.get_json()

    if not isinstance(device_data, list):
        return jsonify({'error': "Expected a list of devices"}), 400

    if not device_data:
        return jsonify({'error': "Received an empty list of devices"}), 400

    if len(device_data) > 1 and not it_is_admin():
        return jsonify({'error': "Only admin allowed to add multiple"
                                 "devices in one request"}), 401

    device_list = []
    device_list_with_location = []
    for item in device_data:
        if not all(key in item for key in ('dev_name', 'dev_manufacturer',
                                           'dev_model', 'class_id',
                                           'dev_location', 'dev_comments')):
            return (jsonify({'error': "All devices must have"
                                      " name,"
                                      " manufacturer,"
                                      " model,"
                                      " class id,"
                                      " location and comments"}),
                    400)

        new_device = Device(dev_name=item['dev_name'],
                            dev_manufacturer=item['dev_manufacturer'],
                            dev_model=item['dev_model'],
                            class_id=item['class_id'],
                            dev_comments=item['dev_comments'])

        device_list.append(new_device)
        device_list_with_location.append((new_device, item['dev_location']))

    dev_db_success, dev_db_error = Device.create_devices(device_list)
    if not dev_db_success:
        return jsonify({'error': f"Database error: {dev_db_error}"}), 500

    home_event_list = []
    for device, location in device_list_with_location:
        generate_qr(device.dev_id)
        new_event_json = {
            'dev_id': device.dev_id,
            'user': {
                'user_name': 'admin',
                'user_email': 'admin@admin'
            },
            'move_time': datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S'),
            'loc_name': location,
            'company': '',
            'comment': ''
        }
        home_event_list.append(new_event_json)

    event_response, event_status_code = create_event(home_event_list)

    if event_status_code != 201:
        print(event_response.get_json())
        return jsonify({'message': "Devices created successfully, "
                                   "but creation events failed"}), 207

    return jsonify({'message': "Devices created successfully"}), 201


def get_device_by_id(dev_id: int) -> tuple[Response, int]:
    device: Optional[Device] = Device.get_device_by_id(dev_id)
    if device:
        return jsonify(device.to_dict()), 200
    return jsonify({'error': 'Device not found'}), 404


def get_events_by_device_id(dev_id: int) -> tuple[Response, int]:
    db_result, status_code = Device.get_events_by_device_id(dev_id)
    if status_code != 200:
        return jsonify({'error': f'{db_result}'}), status_code
    return jsonify(db_result), 200


def update_device(
        dev_id: int, device_data: dict[str, Union[str, int]]) -> tuple[Response, int]:
    valid_fields = {
        'dev_name', 'dev_manufacturer', 'dev_model', 'class_id', 'dev_comments'}

    if not any(key in valid_fields for key in device_data):
        return jsonify({'error': 'No valid fields provided to update'}), 400

    result, error_code = Device.update_device_by_id(dev_id, device_data)

    if error_code == 404:
        return jsonify({'error': 'Device not found'}), 404
    elif error_code:
        return jsonify({'error': result}), error_code
    else:
        updated_device_with_class_id = result.to_dict()
        updated_device_with_class_id["class_id"] = result.class_id
        del updated_device_with_class_id["class_name"]
        return jsonify(updated_device_with_class_id), 200


def remove_devices() -> tuple[Response, int]:
    id_list_json = request.get_json()

    if not isinstance(id_list_json, list):
        return jsonify({'error': "Expected a list of devices"}), 400

    device_id_list = []

    for item in id_list_json:
        if not isinstance(item, dict):
            return jsonify({'error': "Each device must be an object"}), 400

        if 'id' not in item or len(item) != 1:
            return jsonify({'error': "Each device object must have only"
                                     " 'id' attribute"}), 400

        device_id_list.append(item['id'])

    database_response = Device.remove_devices(device_id_list)

    if database_response[0] == 200:
        for dev_id in device_id_list:
            remove_qr(dev_id)
            remove_attachments(dev_id)
        return jsonify({'message': "Devices deleted successfully"}), 200
    elif database_response[0] == 404:
        return (jsonify({'error': f"Failed to delete devices. "
                                  f"{database_response[1]}"}), 404)
    else:
        return jsonify({'error': f"Database error: {database_response[1]}"}), 500


def current_locations() -> tuple[Response, int]:
    locations = Device.get_current_locations()
    return jsonify(locations), 200


def handle_device_csv() -> tuple[Response, int]:
    required_csv_headers = {'dev_name', 'dev_manufacturer', 'dev_model',
                            'dev_class', 'dev_comments', 'dev_location'}

    if 'files' not in request.files:
        return jsonify({'error': "File part missing from the request"}), 400

    csv_file = request.files['files']

    if csv_file.filename == '':
        return jsonify({'error': "File missing from the request"}), 400

    # This might be redundant due to Flask returning 415 UNSUPPORTED MEDIA TYPE
    if csv_file.mimetype != 'text/csv':
        return jsonify({'error': "File MIME type must be 'text/csv'"}), 400

    if not csv_file.filename.lower().endswith('.csv'):
        return jsonify({'error': "File type must be .csv"}), 400

    try:
        csv_data = csv_file.read().decode('utf-8')
    except UnicodeDecodeError:
        return jsonify({'error': 'File must be UTF-8 encoded.'}), 400

    try:
        csv_reader = csv.DictReader(csv_data.splitlines(), delimiter=';')
        actual_headers = set(csv_reader.fieldnames)
        if actual_headers != required_csv_headers:
            missing_headers = required_csv_headers - actual_headers
            extra_headers = actual_headers - required_csv_headers
            return jsonify({'error': f"CSV File missing headers: "
                                     f"{missing_headers}. Extra headers: "
                                     f"{extra_headers}"}), 400

        class_name_set = set()
        device_list = []
        for row in csv_reader:
            dev_class = row.get('dev_class')
            device = {
                'dev_name': row.get('dev_name'),
                'dev_manufacturer': row.get('dev_manufacturer'),
                'dev_model': row.get('dev_model'),
                'dev_class': dev_class,
                'dev_comments': row.get('dev_comments'),
                'dev_location': row.get('dev_location'),
            }
            class_name_set.add(dev_class)
            device_list.append(device)

        try:
            class_dict = get_class_dict(class_name_set)
        except RuntimeError as e:
            return jsonify({'error': str(e)}), 500

        for device in device_list:
            device['class_id'] = class_dict[(device.pop('dev_class'))]
    except Exception as e:
        return jsonify({'error': str(e)}), 400

    device_amount = len(device_list)
    device_result = create_devices(device_list)
    if device_result[1] == 201:
        return jsonify({'message': f"{device_amount} device(s)"
                                   f"imported successfully"}), 201
    else:
        return device_result


def export_device_csv() -> tuple[Response, int]:
    try:
        devices_with_locations = Device.get_devices_in_export_format()
        csv_headers = [
            'dev_name',
            'dev_manufacturer',
            'dev_model',
            'dev_class',
            'dev_comments',
            'dev_location'
        ]
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=csv_headers, delimiter=';')
        writer.writeheader()
        writer.writerows(devices_with_locations)
        csv_content = output.getvalue()
        output.close()
        csv_bytes = csv_content.encode('utf-8')

        return Response(
            csv_bytes,
            mimetype='text/csv; charset=utf-8',
            headers={
                'Content-Disposition': 'attachment; filename=devices.csv'
            }
        ), 200

    except Exception as e:
        return Response(f"Error exporting devices: {str(e)}",
                        mimetype='text/plain'), 500
