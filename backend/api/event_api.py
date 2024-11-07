from flask import Blueprint, Response
from flask_jwt_extended import jwt_required
from backend.controllers.event_controller import (
    get_all_events,
    get_event_by_id,
    create_event,
    update_event,
    remove_event
)

event_api = Blueprint('event_api', __name__)


@event_api.route('/', methods=['GET'])
@jwt_required()
def list_events() -> tuple[Response, int]:
    return get_all_events()


@event_api.route('/<int:event_id>', methods=['GET'])
@jwt_required()
def event_by_id(event_id: int) -> tuple[Response, int]:
    return get_event_by_id(event_id)


@event_api.route('/', methods=['POST'])
def add_event() -> tuple[Response, int]:
    return create_event()


@event_api.route('/<int:event_id>', methods=['PATCH'])
@jwt_required()
def modify_event(event_id: int) -> tuple[Response, int]:
    return update_event(event_id)


@event_api.route('/<int:event_id>', methods=['DELETE'])
@jwt_required()
def delete_event(event_id: int) -> tuple[Response, int]:
    return remove_event(event_id)
