import pytest
from backend.app import create_app
from backend.utils.database_Init import db
from backend.models.device_model import Device


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
    assert data[1]['dev_type'] == "Type A"
    assert data[1]['dev_serial'] == "Test123"
