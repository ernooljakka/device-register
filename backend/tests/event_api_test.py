import pytest
from backend.app import create_app
from backend.setup.database_Init import db
from backend.models.class_model import Class
from backend.models.device_model import Device
from backend.models.event_model import Event
from backend.models.user_model import User
from sqlalchemy.sql import func


@pytest.fixture
def app():
    # Create and configure a new app instance for each test.
    app = create_app(env_config_file=".env.development")

    with app.app_context():
        db.create_all()

        # Add a test class to the database
        test_class: Class = Class(
            class_name="class A"
        )
        db.session.add(test_class)

        # Add two test devices to the database
        test_device1 = Device(dev_name="Device A",
                              dev_manufacturer="Manfact A",
                              dev_model="Model S",
                              class_id=1,
                              dev_comments="Location: Herwood xyz")
        test_device2 = Device(dev_name="Device B",
                              dev_manufacturer="Manfact A",
                              dev_model="Model X",
                              class_id=1,
                              dev_comments="Location: Herwood xyz")
        db.session.add(test_device1)
        db.session.add(test_device2)
        db.session.commit()

        # Add a test user to the database
        test_user = User(user_name="User",
                         user_email="user@mail.com")
        db.session.add(test_user)
        db.session.commit()

        # Add a test event to the database
        test_event1: Event = Event(dev_id=1,
                                   user_id=1,
                                   move_time=func.now(),
                                   loc_name='Lab',
                                   company='Firma',
                                   comment="I have nothing to say")
        test_event2: Event = Event(dev_id=2,
                                   user_id=1,
                                   move_time=func.now(),
                                   loc_name='Lab',
                                   company="Firma",
                                   comment="I have a lot to say")
        db.session.add(test_event1)
        db.session.add(test_event2)
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
        assert event_dict['company'] == event.company
        assert event_dict['comment'] == event.comment


def test_get_all_events(client):
    # Test the GET /api/events endpoint.
    response = client.get('/api/events/')
    assert response.status_code == 200

    data = response.get_json()
    assert len(data) == 2
    assert data[0]['dev_id'] == "1"
    assert data[0]['dev_name'] == "Device A"
    assert data[0]['user_id'] == "1"
    assert data[0]['user_name'] == "User"
    assert data[0]['user_email'] == "user@mail.com"
    assert data[0]['loc_name'] == "Lab"
    assert data[0]['company'] == "Firma"
    assert data[0]['comment'] == "I have nothing to say"
    assert data[1]['dev_id'] == "2"
    assert data[1]['dev_name'] == "Device B"
    assert data[1]['user_id'] == "1"
    assert data[1]['user_name'] == "User"
    assert data[1]['user_email'] == "user@mail.com"
    assert data[1]['loc_name'] == "Lab"
    assert data[1]['company'] == "Firma"
    assert data[1]['comment'] == "I have a lot to say"


def test_get_event_by_id(client):
    # Test the GET /api/events/int:event_id endpoint.
    response = client.get('/api/events/1')
    assert response.status_code == 200

    data = response.get_json()
    assert data['dev_id'] == "1"
    assert data['user_id'] == "1"
    assert data['user_name'] == "User"
    assert data['user_email'] == "user@mail.com"
    assert data['loc_name'] == "Lab"
    assert data['company'] == "Firma"
    assert data['comment'] == "I have nothing to say"

    response_404 = client.get('/api/events/9999')
    assert response_404.status_code == 404


def test_create_event(client):
    payload1 = {
        'dev_id': 1,
        'move_time': "2024-10-02 14:14:28",
        'loc_name': "Room 1",
        'company': "Firma",
        'comment': "You should clean your sockets",
        'user': {
            'user_name': 'User',
            'user_email': 'user@mail.com'
        }
    }
    response1 = client.post('/api/events/', json=payload1)
    assert response1.status_code == 201

    payload2 = [
        {
            'dev_id': 1,
            'move_time': "2024-10-02 14:14:28",
            'loc_name': "Room 1",
            'company': "Firma",
            'comment': "You should clean your sockets",
            'user': {
                'user_name': 'User',
                'user_email': 'user@mail.com'
            }
        },
        {
            'dev_id': 2,
            'move_time': "2024-10-02 14:14:29",
            'loc_name': "Room 1",
            'company': "Firma",
            'comment': "You should clean your room",
            'user': {
                'user_name': 'User',
                'user_email': 'user@mail.com'
            }
        }
    ]
    response2 = client.post('/api/events/', json=payload2)
    assert response2.status_code == 201

    payload3 = "this string is not a dict or list"
    response3 = client.post('/api/events/', json=payload3)
    assert response3.status_code == 400

    payload4 = ["this string inside a list is not a dict"]
    response4 = client.post('/api/events/', json=payload4)
    assert response4.status_code == 400

    payload5 = {
        'dev_id': 1,
        'move_time': "2024-10-02 14:14:28",
        'company': "Firma",
        'comment': "You should clean your sockets",
        'user': {
            'user_name': 'User',
            'user_email': 'user@mail.com'
        }
    }
    response5 = client.post('/api/events/', json=payload5)
    assert response5.status_code == 400

    payload6 = {
        'dev_id': 1,
        'move_time': "2024-10-02 14:14",
        'loc_name': "Room 1",
        'company': "Firma",
        'comment': "You should clean your sockets",
        'user': {
            'user_name': 'User',
            'user_email': 'user@mail.com'
        }
    }
    response6 = client.post('/api/events/', json=payload6)
    assert response6.status_code == 400

    payload7 = {
        'dev_id': 1,
        'move_time': "2024-10-02 14:14:28",
        'loc_name': "Room 1",
        'company': "Firma",
        'comment': "You should clean your sockets",
        'user': 1
    }
    response7 = client.post('/api/events/', json=payload7)
    assert response7.status_code == 400

    payload8 = {
        'dev_id': 1,
        'move_time': "2024-10-02 14:14:28",
        'loc_name': "Room 1",
        'company': "Firma",
        'comment': "You should clean your sockets",
        'user': {
            'user_name': 'User'
        }
    }
    response8 = client.post('/api/events/', json=payload8)
    assert response8.status_code == 400

    payload9 = {
        'dev_id': 9999,
        'move_time': "2024-10-02 14:14:28",
        'loc_name': "Room 1",
        'company': "Firma",
        'comment': "You should clean your sockets",
        'user': {
            'user_name': 'User',
            'user_email': 'user@mail.com'
        }
    }
    response9 = client.post('/api/events/', json=payload9)
    assert response9.status_code == 500


def test_patch_event(client):
    # Test the PATCH /api/events/int:event_id endpoint.
    payload1 = {
        'dev_id': 2
    }
    response1 = client.patch('/api/events/1', json=payload1)
    assert response1.status_code == 200

    event1 = client.get('/api/events/1')
    assert event1.get_json()['dev_id'] == "2"

    payload2 = {
        'dev_id': 1,
        'move_time': "2024-10-03 14:14:29",
        'loc_name': "Room 2",
        'company': "Joku toinen firma",
        'comment': "You should clean your sockets",
        'user': {
            'user_name': 'No longer User',
            'user_email': 'user@othermail.com'
        }
    }
    response2 = client.patch('/api/events/1', json=payload2)
    assert response2.status_code == 200

    event2 = client.get('/api/events/1')
    event2_json = event2.get_json()
    assert event2_json['dev_id'] == "1"
    assert event2_json['move_time'] == "2024-10-03T14:14:29"
    assert event2_json['loc_name'] == "Room 2"
    assert event2_json['company'] == 'Joku toinen firma'
    assert event2_json['comment'] == "You should clean your sockets"
    user_id = event2_json['user_id']
    user_response = client.get(f'/api/users/{user_id}')
    user_info = user_response.get_json()
    assert user_info['user_name'] == 'No longer User'
    assert user_info['user_email'] == 'user@othermail.com'

    payload3 = {
        'dev_id': 3
    }
    response3 = client.patch('/api/events/1', json=payload3)
    assert response3.status_code == 500

    payload4 = {
        'dev_id': 2
    }
    response4 = client.patch('/api/events/404', json=payload4)
    assert response4.status_code == 404

    payload5 = [
        {
            'dev_id': 1,
        }
    ]
    response5 = client.patch('/api/events/1', json=payload5)
    assert response5.status_code == 400

    payload6 = {
        'dev_id': 2,
        'wrong': "key"
    }
    response6 = client.patch('/api/events/1', json=payload6)
    assert response6.status_code == 400

    payload7 = {
        'dev_id': 1,
        'move_time': "2024-10-03 14:14:29",
        'loc_name': "Room 2",
        'company': "Testifirma",
        'comment': "You should clean your sockets",
        'user': {
            'naam': 'No longer User',
            'email': 'user@othermail.com'
        }
    }
    response7 = client.patch('/api/events/1', json=payload7)
    assert response7.status_code == 400

    payload8 = {
        'dev_id': 1,
        'move_time': "2024-10-03 14:14:29",
        'loc_name': "Room 2",
        'company': "Testifirma",
        'comment': "You should clean your sockets",
        'user': {
            'user_name': 'No longer User',
            'eeem': 'user@othermail.com'
        }
    }
    response8 = client.patch('/api/events/1', json=payload8)
    assert response8.status_code == 400

    payload8 = {
        'dev_id': 1,
        'move_time': "2024-10-03 14:14:29",
        'loc_name': "Room 2",
        'company': "Testifirma",
        'comment': "You should clean your sockets",
        'user': [
            {
                'user_name': 'No longer User',
                'eeem': 'user@othermail.com'
            }
        ]
    }
    response8 = client.patch('/api/events/1', json=payload8)
    assert response8.status_code == 400

    payload10 = {
        'move_time': "2024-10-03 14:14"
    }
    response10 = client.patch('/api/events/1', json=payload10)
    assert response10.status_code == 400


def test_remove_event(client):
    # Test the DELETE /api/events/int:event_id endpoint.
    response_delete = client.delete('/api/events/1')
    assert response_delete.status_code == 200

    response_get_deleted = client.get('/api/events/1')
    assert response_get_deleted.status_code == 404

    response_delete_404 = client.delete('/api/events/9999')
    assert response_delete_404.status_code == 404
