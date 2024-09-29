from flask import Blueprint, Response
from backend.controllers.event_controller import (
    get_all_events,
    get_event_by_id,
    remove_event
)

event_api = Blueprint('event_api', __name__)


@event_api.route('/', methods=['GET'])
def list_events() -> tuple[Response, int]:
    return get_all_events()


@event_api.route('/<int:event_id>', methods=['GET'])
def event_by_id(event_id: int) -> tuple[Response, int]:
    return get_event_by_id(event_id)


@event_api.route('/<int:event_id>', methods=['DELETE'])
def delete_event(event_id: int) -> tuple[Response, int]:
    return remove_event(event_id)
