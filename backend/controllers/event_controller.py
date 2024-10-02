from flask import jsonify, request, Response
from backend.models.event_model import Event
from backend.controllers.user_controller import add_or_update_user
from datetime import datetime


def get_all_events() -> tuple[Response, int]:
    all_events: list[Event] = Event.get_all_events()
    event_list: list[dict[str, str]] = [
        event.to_dict() for event in all_events
    ]
    print(event_list)
    return jsonify(event_list), 200


def get_event_by_id(event_id: int) -> tuple[Response, int]:
    one_event: Event = Event.get_event_by_id(event_id)
    print(one_event)
    if one_event is not None:
        event_dict = one_event.to_dict()
        return jsonify(event_dict), 200
    else:
        return jsonify({'error': f'No event exists with provided Id: {event_id}'}), 404


def create_event() -> tuple[Response, int]:
    event_json = request.get_json()

    if not isinstance(event_json, dict):
        return jsonify({'error': "Expected an event object"}), 400

    if not all(key in event_json for key in ('dev_id',
                                             'user',
                                             'move_time',
                                             'loc_name')):
        return (jsonify({'error': "Event must have"
                                  " dev_id,"
                                  " move_time"
                                  " loc_name, and"
                                  " user"}),
                400)

    try:
        move_time = datetime.strptime(event_json['move_time'],
                                      '%Y-%m-%d %H:%M:%S')
    except ValueError:
        return jsonify({'error': "Expected time format: YYYY-MM-DD HH:MM:SS"}), 400

    user_info = event_json['user']

    if not isinstance(user_info, dict):
        return jsonify({'error': "Expected user attribute to be object"}), 400

    if not all(key in user_info for key in ('name', 'email')):
        return jsonify({'error': "User object must contain name and email"}), 400

    user_info['user_email'] = user_info.pop('email')
    user_info['user_name'] = user_info.pop('name')
    user_response = add_or_update_user(user_info)
    if not user_response[1] in (200, 201):
        return jsonify({'error': f'Problem adding or updating user: '
                                 f'{user_response[0]}'
                        }), user_response[1]
    user_json = user_response[0].get_json()
    user_id = user_json['user_id']

    new_event = Event(dev_id=event_json['dev_id'],
                      user_id=user_id,
                      move_time=move_time,
                      loc_name=event_json['loc_name'])

    database_response = Event.create_event(new_event)
    if database_response[0]:
        return jsonify({'message': "Event created successfully"}), 201
    else:
        return jsonify({'error': f"Database error: {database_response[1]}"}), 500


def remove_event(event_id: int) -> tuple[Response, int]:
    if Event.remove_event(event_id):
        return jsonify({'message': f'Deleted event with provided Id: {event_id}'}), 200
    else:
        return jsonify({'error': f'No event exists with provided Id: {event_id}'}), 404
