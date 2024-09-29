from flask import jsonify, Response
from backend.models.event_model import Event


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


def remove_event(event_id: int) -> tuple[Response, int]:
    if Event.remove_event(event_id):
        return jsonify({'message': f'Deleted event with provided Id: {event_id}'}), 200
    else:
        return jsonify({'error': f'No event exists with provided Id: {event_id}'}), 404
