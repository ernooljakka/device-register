import pytest
from backend.app import create_app
from backend.utils.database_Init import db
from backend.models.device_model import Device


@pytest.fixture
def app():
    # Create and configure a new app instance for each test.
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

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

    yield app

    # Clean up / reset the database after each tests
    with app.app_context():
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    # A tests client for the app.
    return app.test_client()


def test_get_devices(client):
    # Test the GET /api/devices/ endpoint.
    response = client.get('/api/devices/')
    assert response.status_code == 200  # Check that the status code is 200 OK

    data = response.get_json()
    assert len(data) == 2

    assert data[1]['dev_name'] == "Device"
    assert data[1]['dev_manufacturer'] == "Manfact A"
    assert data[1]['dev_model'] == "Model S"
    assert data[1]['dev_class'] == "class A"


def test_post_devices(client, app):
    # Test the POST /api/devices/ endpoint.
    payload1 = [
        {
            "name": "Device 1",
            "manufacturer": "Company A",
            "model": "M1",
            "class": "C1",
            "comments": ""
        },
        {
            "name": "Device 2",
            "manufacturer": "Company A",
            "model": "M2",
            "class": "C1",
            "comments": ""
        }
    ]
    response1 = client.post('/api/devices/', json=payload1)
    assert response1.status_code == 201

    payload2 = {
            "name": "Device 3",
            "manufacturer": "Company A",
            "model": "M3",
            "class": "C1",
            "comments": ""
    }
    response_not_list = client.post('/api/devices/', json=payload2)
    assert response_not_list.status_code == 400

    payload3 = [
        {
            "name": "Device 4",
            "manufacturer": "Company A",
            "model": "M4",
            "class": "C1",
            "comments": ""
        },
        {
            "name": "Device 5",
            "manufacturer": "Company B",
            "model": "M5",
            "comments": ""
        }
    ]
    response_missing_field = client.post('/api/devices/', json=payload3)
    assert response_missing_field.status_code == 400

    with app.app_context():
        devices = Device.query.all()

        assert len(devices) == 4

        device_1 = devices[2]
        assert device_1.dev_name == "Device 1"
        assert device_1.dev_manufacturer == "Company A"
        assert device_1.dev_model == "M1"
        assert device_1.dev_class == "C1"
        assert device_1.dev_comments == ""

        device_2 = devices[3]
        assert device_2.dev_name == "Device 2"
        assert device_2.dev_manufacturer == "Company A"
        assert device_2.dev_model == "M2"
        assert device_2.dev_class == "C1"
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
    assert data['dev_class'] == "class A"
    assert data['dev_comments'] == "Location: Herwood xyz"

    response_404 = client.get('/api/users/9999')
    assert response_404.status_code == 404
