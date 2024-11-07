from datetime import datetime
from flask import jsonify, request, Response
from backend.models.event_model import Event
from backend.controllers.user_controller import add_or_update_user


def get_all_events() -> tuple[Response, int]:
    all_events: list[Event] = Event.get_all_events()

    event_list: list[dict[str, str]] = []

    for event in all_events:
        event_dict = event.to_dict()
        event_dict['user_name'] = event.user.user_name if event.user else None
        event_dict['user_email'] = event.user.user_email if event.user else None
        event_dict['dev_name'] = event.device.dev_name if event.device else None
        event_list.append(event_dict)

    return jsonify(event_list), 200


def get_event_by_id(event_id: int) -> tuple[Response, int]:
    one_event: Event = Event.get_event_by_id(event_id)

    if one_event is not None:
        event_dict = one_event.to_dict()
        event_dict['user_name'] = one_event.user.user_name
        event_dict['user_email'] = one_event.user.user_email
        return jsonify(event_dict), 200
    else:
        return jsonify({'error': f'No event exists with provided Id: {event_id}'}), 404


def create_event(event_data=None) -> tuple[Response, int]:
    if not event_data:
        event_data = request.get_json()

    if not isinstance(event_data, (dict, list)):
        return jsonify({'error': "Expected an event object or list"}), 400

    # turn dict into a list, or check list contains dicts
    if isinstance(event_data, dict):
        event_data_list = [event_data]
    else:
        event_data_list = event_data
        for item in event_data_list:
            if not isinstance(item, dict):
                return jsonify({'error': "Expected event objects in the list"}), 400

    event_list = []

    last_user = None
    not_ok_status = 500
    response_str = "Event Controller error"
    for event_item in event_data_list:
        if not all(key in event_item for key in ('dev_id',
                                                 'user',
                                                 'move_time',
                                                 'loc_name',
                                                 'company',
                                                 'comment')):
            return (jsonify({'error': "Event must have"
                                      " dev_id,"
                                      " move_time,"
                                      " loc_name,"
                                      " company,"
                                      " comment, and"
                                      " user"}),
                    400)

        try:
            move_time = datetime.strptime(event_item['move_time'],
                                          '%Y-%m-%d %H:%M:%S')
        except ValueError:
            return jsonify({'error': "Expected time format: YYYY-MM-DD HH:MM:SS"}), 400

        user_info = event_item['user']

        if not isinstance(user_info, dict):
            return jsonify({'error': "Expected user attribute to be object"}), 400

        if not all(key in user_info for key in ('user_name', 'user_email')):
            return jsonify({'error': "User object must contain name and email"}), 400

        if user_info != last_user:
            not_ok_status, response_str = add_or_update_user_util(user_info)
        last_user = user_info

        if not_ok_status:
            return jsonify({'error': f'Problem adding or updating user: '
                                     f'{response_str}'
                            }), not_ok_status
        else:
            user_id = response_str

        new_event = Event(dev_id=event_item['dev_id'],
                          user_id=user_id,
                          move_time=move_time,
                          loc_name=event_item['loc_name'],
                          company=event_item['company'],
                          comment=event_item['comment'])
        event_list.append(new_event)

    database_response = Event.create_event(event_list)
    if database_response[0]:
        return jsonify({'message': "Event created successfully"}), 201
    else:
        return jsonify({'error': f"Database error: {database_response[1]}"}), 500


def update_event(event_id: int) -> tuple[Response, int]:
    event = Event.get_event_by_id(event_id)
    if event is None:
        return jsonify({'error': f"Event could not be found by id: {event_id}"}), 404

    event_json = request.get_json()

    if not isinstance(event_json, dict):
        return jsonify({'error': "Expected an event object"}), 400

    allowed_keys = {'dev_id', 'user', 'move_time',
                    'loc_name', 'company', 'comment'}
    invalid_keys = set(event_json.keys()) - allowed_keys
    if invalid_keys:
        return jsonify({'error': f"Illegal keys :{', '.join(invalid_keys)}"}), 400

    if 'dev_id' in event_json:
        event.dev_id = event_json['dev_id']

    if 'user' in event_json:
        user_info = event_json['user']
        if not isinstance(user_info, dict):
            return jsonify({'error': "Expected user attribute to be an object"}), 400

        if 'user_name' in user_info and 'user_email' in user_info:
            not_ok_status, response_str = add_or_update_user_util(user_info)
            if not_ok_status:
                return jsonify({'error': f'Problem adding or updating user: '
                                         f'{response_str}'}), not_ok_status
            else:
                event.user_id = response_str
        else:
            return jsonify({'error': "User object must contain user_name"
                                     " and user_email"}), 400

    if 'move_time' in event_json:
        try:
            event.move_time = datetime.strptime(event_json['move_time'],
                                                '%Y-%m-%d %H:%M:%S')
        except ValueError:
            return (jsonify({'error': "Expected time format: YYYY-MM-DD HH:MM:SS"}),
                    400)

    if 'loc_name' in event_json:
        event.loc_name = event_json['loc_name']

    if 'company' in event_json:
        event.company = event_json['company']

    if 'comment' in event_json:
        event.comment = event_json['comment']

    update_success, db_error = Event.update_event()
    if update_success:
        return (jsonify({'message': f"Event updated successfully, id: {event_id}"}),
                200)
    else:
        return jsonify({'error': f"Database error: {db_error}"}), 500


def remove_event(event_id: int) -> tuple[Response, int]:
    if Event.remove_event(event_id):
        return jsonify({'message': f'Deleted event with provided Id: {event_id}'}), 200
    else:
        return jsonify({'error': f'No event exists with provided Id: {event_id}'}), 404


def add_or_update_user_util(user_info) -> tuple['int', 'str']:
    user_response = add_or_update_user(user_info)
    if user_response[1] in (200, 201):
        return 0, user_response[0].get_json()['user_id']
    else:
        return user_response[1], str(user_response[0])
