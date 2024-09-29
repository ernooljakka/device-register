from flask import Blueprint, Response
from backend.controllers.event_controller import get_all_events

event_api = Blueprint('event_api', __name__)


@event_api.route('/', methods=['GET'])
def list_events() -> tuple[Response, int]:
    return get_all_events()
