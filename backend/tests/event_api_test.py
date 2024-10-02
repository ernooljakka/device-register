import pytest
from backend.app import create_app
from backend.utils.database_Init import db
from backend.models.device_model import Device
from backend.models.event_model import Event
from backend.models.user_model import User
from sqlalchemy.sql import func


@pytest.fixture
def app():
    # Create and configure a new app instance for each test.
    app = create_app(testing=True)

    with app.app_context():
        db.create_all()
        # Add a tests device to the database
        test_device = Device(dev_name="Device",
                             dev_manufacturer="Manfact A",
                             dev_model="Model S",
                             dev_class="class A",
                             dev_comments="Location: Herwood xyz")

        db.session.add(test_device)
        db.session.commit()

        # Add a test user to the database
        test_user = User(user_name="User",
                         user_email="user@mail.com")
        db.session.add(test_user)
        db.session.commit()

        # Add a test event to the database
        test_event: Event = Event(dev_id=1,
                                  user_id=1,
                                  move_time=func.now(),
                                  loc_name='Lab')
        db.session.add(test_event)
        db.session.commit()

    yield app

    # Clean up / reset the database after each test.
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


def test_get_event_by_id(client):
    # Test the GET /api/events/int:event_id endpoint.
    response = client.get('/api/events/1')
    assert response.status_code == 200

    data = response.get_json()
    assert data['dev_id'] == "1"
    assert data['user_id'] == "1"
    assert data['loc_name'] == "Lab"

    response_404 = client.get('/api/events/9999')
    assert response_404.status_code == 404


def test_create_event(client):
    payload1 = {
        'dev_id': 1,
        'move_time': "2024-10-02 14:14:28",
        'loc_name': "Room 1",
        'user': {
            'name': 'User',
            'email': 'user@mail.com'
        }
    }
    response1 = client.post('/api/events/', json=payload1)
    assert response1.status_code == 201

    payload2 = [
        {
            'dev_id': 1,
            'move_time': "2024-10-02 14:14:28",
            'loc_name': "Room 1",
            'user': {
                'name': 'User',
                'email': 'user@mail.com'
            }
        }
    ]
    response2 = client.post('/api/events/', json=payload2)
    assert response2.status_code == 400

    payload3 = {
        'dev_id': 1,
        'move_time': "2024-10-02 14:14:28",
        'user': {
            'name': 'User',
            'email': 'user@mail.com'
        }
    }
    response3 = client.post('/api/events/', json=payload3)
    assert response3.status_code == 400

    payload4 = {
        'dev_id': 1,
        'move_time': "2024-10-02 14:14",
        'loc_name': "Room 1",
        'user': {
            'name': 'User',
            'email': 'user@mail.com'
        }
    }
    response4 = client.post('/api/events/', json=payload4)
    assert response4.status_code == 400

    payload5 = {
        'dev_id': 1,
        'move_time': "2024-10-02 14:14:28",
        'loc_name': "Room 1",
        'user': 1
    }
    response5 = client.post('/api/events/', json=payload5)
    assert response5.status_code == 400

    payload6 = {
        'dev_id': 1,
        'move_time': "2024-10-02 14:14:28",
        'loc_name': "Room 1",
        'user': {
            'name': 'User'
        }
    }
    response6 = client.post('/api/events/', json=payload6)
    assert response6.status_code == 400

    payload7 = {
        'dev_id': 9999,
        'move_time': "2024-10-02 14:14:28",
        'loc_name': "Room 1",
        'user': {
            'name': 'User',
            'email': 'user@mail.com'
        }
    }
    response7 = client.post('/api/events/', json=payload7)
    assert response7.status_code == 500


def test_remove_event(client):
    # Test the DELETE /api/events/int:event_id endpoint.
    response_delete = client.delete('/api/events/1')
    assert response_delete.status_code == 200

    response_get_deleted = client.get('/api/events/1')
    assert response_get_deleted.status_code == 404

    response_delete_404 = client.delete('/api/events/9999')
    assert response_delete_404.status_code == 404
