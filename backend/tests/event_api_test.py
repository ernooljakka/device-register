import pytest
from backend.app import create_app
from backend.utils.database_Init import db
from backend.models.device_model import Device
from backend.models.event_model import Event
from sqlalchemy.sql import func


@pytest.fixture
def app():
    # Create and configure a new app instance for each tests.
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    with app.app_context():
        db.create_all()
        # Add a tests device to the database
        test_device = Device(dev_name="Device",
                             dev_type="Type A",
                             dev_serial="Test123")
        db.session.add(test_device)
        db.session.commit()

        # Add a test event to the database
        test_event: Event = Event(dev_id=1,
                                  user_id=1,
                                  move_time=func.now(),
                                  loc_name='Lab')
        db.session.add(test_event)
        db.session.commit()

    yield app

    # Clean up / reset the database after each tests
    with app.app_context():
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    # A tests client for the app.
    return app.test_client()


def test_event_to_dict(app):
    with app.app_context():
        event = Event.query.first()

        event_dict = event.to_dict()

        assert event_dict['event_id'] == str(event.event_id)
        assert event_dict['dev_id'] == str(event.dev_id)
        assert event_dict['user_id'] == str(event.user_id)
        assert event_dict['loc_name'] == event.loc_name
        assert event_dict['move_time'] == event.move_time.isoformat()


def test_get_all_events(client):
    # Test the GET /api/events endpoint.
    response = client.get('/api/events/')
    assert response.status_code == 200

    data = response.get_json()
    assert len(data) == 1
    assert data[0]['dev_id'] == "1"
    assert data[0]['user_id'] == "1"
    assert data[0]['loc_name'] == "Lab"
