import os
import pytest
from backend.app import create_app
from backend.setup.database_Init import db
from backend.models.class_model import Class
from backend.models.device_model import Device
from backend.models.event_model import Event
from backend.models.user_model import User
from flask_jwt_extended import create_access_token
from sqlalchemy.sql import func

from backend.utils.config import config


@pytest.fixture
def app():
    # Create and configure a new app instance for each test.
    app = create_app(".env.development")

    with app.app_context():
        db.create_all()

        # Add a test class to the database
        test_class: Class = Class(
            class_name="class A"
        )
        db.session.add(test_class)

        # Add a test device to the database
        test_device: Device = Device(
            dev_name="Device",
            dev_manufacturer="Manfact A",
            dev_model="Model S",
            dev_home="Home",
            class_id=1,
            dev_comments="Location: Herwood xyz")

        db.session.add(test_device)
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


@pytest.fixture
def auth_header(app):
    with app.app_context():
        access_token = create_access_token(identity="tester")
        return {"Authorization": f"Bearer {access_token}"}


def test_get_devices(client):
    # Test the GET /api/devices/ endpoint.
    response = client.get('/api/devices/')
    assert response.status_code == 200  # Check that the status code is 200 OK

    data = response.get_json()
    assert len(data) == 1

    assert data[0]['dev_name'] == "Device"
    assert data[0]['dev_manufacturer'] == "Manfact A"
    assert data[0]['dev_model'] == "Model S"
    assert data[0]['dev_home'] == "Home"
    assert data[0]['class_name'] == "class A"
    assert data[0]['dev_comments'] == "Location: Herwood xyz"


def test_post_devices(client, app, mocker):
    # Test the POST /api/devices/ endpoint.
    mocker.patch('backend.app.it_is_admin',
                 return_value=True)
    mocker.patch('backend.controllers.event_controller.it_is_admin',
                 return_value=True)

    payload1 = [
        {
            "dev_name": "Device 1",
            "dev_manufacturer": "Company A",
            "dev_model": "M1",
            "dev_home": "Home",
            "class_id": 1,
            "dev_location": "Lab",
            "dev_comments": ""
        },
        {
            "dev_name": "Device 2",
            "dev_manufacturer": "Company A",
            "dev_model": "M2",
            "dev_home": "Home",
            "class_id": 1,
            "dev_location": "lab",
            "dev_comments": ""
        }
    ]
    response_401 = client.post('/api/devices/', json=payload1)
    assert response_401.status_code == 401

    mocker.patch('backend.controllers.device_controller.it_is_admin',
                 return_value=True)
    response1 = client.post('/api/devices/', json=payload1)
    assert response1.status_code == 201

    with app.app_context():
        devices = Device.query.all()

        assert len(devices) == 3

        # Clean up the created QR images
        for device in devices:
            dev_id = device.dev_id
            qr_image_path = os.path.join(config.PROJECT_ROOT, 'backend', 'static', 'qr',
                                         f"{dev_id}.png")
            if os.path.exists(qr_image_path):
                os.remove(qr_image_path)

    payload2 = {
        "dev_name": "Device 3",
        "dev_manufacturer": "Company A",
        "dev_model": "M3",
        "dev_home": "Home",
        "class_id": 1,
        "dev_comments": ""
    }
    response_not_list = client.post('/api/devices/', json=payload2)
    assert response_not_list.status_code == 400

    payload3 = [
        {
            "dev_name": "Device 4",
            "dev_manufacturer": "Company A",
            "dev_model": "M4",
            "dev_home": "Home",
            "class_id": 1,
            "dev_comments": ""
        },
        {
            "dev_name": "Device 5",
            "dev_manufacturer": "Company B",
            "dev_model": "M5",
            "dev_home": "Home",
            "dev_comments": ""
        }
    ]
    response_missing_field = client.post('/api/devices/', json=payload3)
    assert response_missing_field.status_code == 400

    response_empty_list = client.post('/api/devices/', json=[])
    assert response_empty_list.status_code == 400

    payload4 = [
        {
            "dev_name": "Device 1",
            "dev_manufacturer": "Company A",
            "dev_model": "M1",
            "dev_home": "Home",
            "class_id": 9999,
            "dev_location": "Lab",
            "dev_comments": ""
        }
    ]
    response_nonexistent_class = client.post('/api/devices/', json=payload4)
    assert response_nonexistent_class.status_code == 500

    with app.app_context():
        devices = Device.query.all()

        assert len(devices) == 3

        device_1 = devices[1]
        assert device_1.dev_name == "Device 1"
        assert device_1.dev_manufacturer == "Company A"
        assert device_1.dev_model == "M1"
        assert device_1.dev_home == "Home"
        assert device_1.class_id == 1
        assert device_1.dev_comments == ""

        device_2 = devices[2]
        assert device_2.dev_name == "Device 2"
        assert device_2.dev_manufacturer == "Company A"
        assert device_2.dev_model == "M2"
        assert device_2.dev_home == "Home"
        assert device_2.class_id == 1
        assert device_2.dev_comments == ""


def test_get_device_by_id(client):
    # Test the GET /api/devices/int:dev_id endpoint.
    response = client.get('/api/devices/1')
    assert response.status_code == 200

    data = response.get_json()
    assert data['dev_id'] == "1"
    assert data['dev_name'] == "Device"
    assert data['dev_manufacturer'] == "Manfact A"
    assert data['dev_model'] == "Model S"
    assert data['dev_home'] == "Home"
    assert data['class_name'] == "class A"
    assert data['dev_comments'] == "Location: Herwood xyz"

    response_404 = client.get('/api/devices/9999')
    assert response_404.status_code == 404


def test_update_device_by_id(client, auth_header):
    # Test the PATCH /api/devices/int:dev_id endpoint.
    new_device_data = {
        "dev_name": "New device",
        "dev_manufacturer": "Toyota",
        "dev_model": "Corolla",
        "dev_home": "New Home",
        "class_id": 1,
        "dev_comments": "Moved to Timbuktu"
    }

    response = client.patch('/api/devices/1',
                            json=new_device_data,
                            headers=auth_header)

    assert response.status_code == 200

    updated_device = response.get_json()

    assert updated_device['dev_name'] == "New device"
    assert updated_device['dev_manufacturer'] == "Toyota"
    assert updated_device['dev_model'] == "Corolla"
    assert updated_device['dev_home'] == "New Home"
    assert updated_device['class_id'] == 1
    assert updated_device['dev_comments'] == "Moved to Timbuktu"

    # Verify that updating a non-existent device returns 404
    response_404 = client.patch('/api/devices/9999',
                                json=new_device_data,
                                headers=auth_header)
    assert response_404.status_code == 404

    nonexistent_class_device = {
        "dev_name": "New device",
        "dev_manufacturer": "Toyota",
        "dev_model": "Corolla",
        "dev_home": "Home",
        "class_id": 9999,
        "dev_comments": "Moved to Timbuktu"
    }
    response_bad_class = client.patch('/api/devices/1',
                                      json=nonexistent_class_device,
                                      headers=auth_header)
    assert response_bad_class.status_code == 500

    response_unauthorized = client.patch('/api/devices/1',
                                         json=new_device_data)
    assert response_unauthorized.status_code == 401


def test_update_device_invalid_fields(client, auth_header):
    # Test updating with invalid fields
    invalid_device_data = {
        "invalid_field": "some value"
    }
    response = client.patch('/api/devices/1',
                            json=invalid_device_data,
                            headers=auth_header)

    assert response.status_code == 400
    data = response.get_json()
    assert data['error'] == 'No valid fields provided to update'


def test_get_events_by_device_id(client, app):
    # Test the GET /api/<int:dev_id>/events endpoint.
    with app.app_context():
        test_user: User = User(user_name="User", user_email="user@mail.com")
        db.session.add(test_user)
        db.session.commit()

        test_event1: Event = Event(
            dev_id=1,
            user_id=1,
            move_time=func.now(),
            loc_name='Lab',
            company='Firma 1',
            comment='Hello')
        db.session.add(test_event1)
        db.session.commit()

        test_event2: Event = Event(
            dev_id=1,
            user_id=1,
            move_time=func.now(),
            loc_name='Labz',
            company='Firma 2',
            comment='Hi')
        db.session.add(test_event2)
        db.session.commit()

        response = client.get('/api/devices/1/events')
        assert response.status_code == 200

        data = response.get_json()
        assert len(data) == 2
        assert data[0]['dev_id'] == "1"
        assert data[0]['user_id'] == "1"
        assert data[0]['loc_name'] == "Lab"
        assert data[0]['company'] == "Firma 1"
        assert data[0]['comment'] == "Hello"
        assert data[0]['user_name'] == "User"
        assert data[1]['dev_id'] == "1"
        assert data[1]['user_id'] == "1"
        assert data[1]['loc_name'] == "Labz"
        assert data[1]['company'] == "Firma 2"
        assert data[1]['comment'] == "Hi"
        assert data[1]['user_name'] == "User"

        response_404 = client.get('/api/devices/25565/events')
        assert response_404.status_code == 404


def test_remove_devices(client, app, auth_header):
    # Test the DELETE /api/devices/ endpoint.
    with app.app_context():
        test_user = User(user_name="testuser", user_email="testuser@example.com")
        db.session.add(test_user)
        db.session.commit()

        test_device1 = Device(
            dev_name="Device 1",
            dev_manufacturer="Manfact A",
            dev_model="Model S",
            dev_home="Home",
            class_id=1,
            dev_comments="Location: Herwood xyz",
        )
        test_device2 = Device(
            dev_name="Device 2",
            dev_manufacturer="Manfact A",
            dev_model="Model T",
            dev_home="Home",
            class_id=1,
            dev_comments="Location: Herwood xyz",
        )

        db.session.add(test_device1)
        db.session.add(test_device2)
        db.session.commit()

        dev_id1 = test_device1.dev_id
        dev_id2 = test_device2.dev_id

        test_event1 = Event(
            dev_id=dev_id1,
            user_id=test_user.user_id,
            move_time=func.now(),
            loc_name='Lab',
            company='Firma 1',
            comment='Event 1',
        )
        test_event2 = Event(
            dev_id=dev_id2,
            user_id=test_user.user_id,
            move_time=func.now(),
            loc_name='Lab',
            company='Firma 2',
            comment='Event 2',
        )

        db.session.add(test_event1)
        db.session.add(test_event2)
        db.session.commit()

        payload = [{'id': dev_id1}, {'id': dev_id2}]
        response_unauthorized = client.delete('/api/devices/',
                                              json=payload)
        assert response_unauthorized.status_code == 401

        response = client.delete('/api/devices/',
                                 json=payload,
                                 headers=auth_header)
        assert response.status_code == 200

        assert db.session.get(Device, dev_id1) is None
        assert db.session.get(Device, dev_id2) is None


def test_get_current_locations(client, app):
    # Test the GET /api/devices/current_locations/ endpoint.
    with app.app_context():
        test_user: User = User(user_name="User", user_email="user@mail.com")
        db.session.add(test_user)
        db.session.commit()

        test_device1: Device = Device(
            dev_name="Unique Device 1",
            dev_manufacturer="Unique Manufacturer 1",
            dev_model="Unique Model 1",
            dev_home="Home",
            class_id=1,
            dev_comments="Location: Unique Location 1"
        )
        db.session.add(test_device1)
        db.session.commit()

        test_device2: Device = Device(
            dev_name="Unique Device 2",
            dev_manufacturer="Unique Manufacturer 2",
            dev_model="Unique Model 2",
            dev_home="Home",
            class_id=1,
            dev_comments="Location: Unique Location 2"
        )
        db.session.add(test_device2)
        db.session.commit()

        event1: Event = Event(
            dev_id=test_device1.dev_id,
            user_id=test_user.user_id,
            move_time=func.now(),
            loc_name="Location 1",
            company='Firma 1',
            comment="Device 1 is here"
        )
        db.session.add(event1)

        event2: Event = Event(
            dev_id=test_device2.dev_id,
            user_id=test_user.user_id,
            move_time=func.now(),
            loc_name="Location 2",
            company='Firma 2',
            comment="Device 2 is here"
        )
        db.session.add(event2)

        db.session.commit()

        response = client.get('/api/devices/current_locations/')
        assert response.status_code == 200

        data = response.get_json()
        assert len(data) == 3

        assert data[1]['dev_id'] == str(test_device1.dev_id)
        assert data[1]['dev_name'] == test_device1.dev_name
        assert data[1]['dev_model'] == test_device1.dev_model
        assert data[1]['dev_manufacturer'] == test_device1.dev_manufacturer
        assert data[1]['dev_home'] == test_device1.dev_home
        assert data[1]['class_name'] == "class A"
        assert data[1]['loc_name'] == "Location 1"

        assert data[2]['dev_id'] == str(test_device2.dev_id)
        assert data[2]['dev_name'] == test_device2.dev_name
        assert data[2]['dev_model'] == test_device2.dev_model
        assert data[2]['dev_manufacturer'] == test_device2.dev_manufacturer
        assert data[2]['dev_home'] == test_device2.dev_home
        assert data[1]['class_name'] == "class A"
        assert data[2]['loc_name'] == "Location 2"

        response_404 = client.get('/api/devices/9999/current_locations/')
        assert response_404.status_code == 404


def test_device_import_from_csv(client, mocker, auth_header):
    # Test the GET /api/devices/import/ endpoint.
    mocker.patch('backend.app.it_is_admin',
                 return_value=True)
    mocker.patch('backend.controllers.event_controller.it_is_admin',
                 return_value=True)
    mocker.patch('backend.controllers.device_controller.it_is_admin',
                 return_value=True)

    test_csv_path = os.path.join(
        config.PROJECT_ROOT, 'deployment_confs', 'test.csv'
    )

    with open(test_csv_path, 'rb') as csv_file:
        response1 = client.post('/api/devices/import/',
                                headers=auth_header,
                                data={'files': (csv_file, 'test.csv')})
    assert response1.status_code == 201

    test_jpg_path = os.path.join(
        config.PROJECT_ROOT, 'backend', 'tests', 'static',
        'attachments', 'test_files', 'cat.jpg'
    )

    with open(test_jpg_path, 'rb') as jpg_file:
        response2 = client.post('/api/devices/import/',
                                headers=auth_header,
                                data={'files': (jpg_file, 'cat.jpg')})
    assert response2.status_code == 400

    malformed_csv_path = os.path.join(
        config.PROJECT_ROOT, 'backend', 'tests', 'static',
        'attachments', 'test_files', 'not_supported.csv'
    )
    with open(malformed_csv_path, 'rb') as bad_csv_file:
        response3 = client.post('/api/devices/import/',
                                headers=auth_header,
                                data={'files': (bad_csv_file, 'not_supported.csv')})
    assert response3.status_code == 400

    response4 = client.post('/api/devices/import/',
                            headers=auth_header)
    assert response4.status_code == 400
