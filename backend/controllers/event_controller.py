from flask import jsonify, Response
from backend.models.event_model import Event


def get_all_events() -> tuple[Response, int]:
    all_events: list[Event] = Event.get_all_events()
    event_list: list[dict[str, str]] = [
        event.to_dict() for event in all_events
    ]
    print(event_list)
    return jsonify(event_list), 200
