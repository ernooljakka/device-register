import os
import pytest
from backend.app import create_app
from backend.setup.database_Init import db
from backend.models.device_model import Device
from backend.utils.qr_generator import generate_qr, remove_qr


@pytest.fixture
def app():
    # Create and configure a new app instance for each test.
    app = create_app(testing=True)

    with app.app_context():
        db.create_all()
        # Add a tests device to the database
        test_device: Device = Device(
            dev_name="Device",
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


def test_generate_qr(client, app):
    with app.app_context():
        device: Device = Device.query.first()

    dev_id = device.dev_id
    generate_qr(dev_id, testing=True)

    qr_image_path = os.path.join(os.getcwd(), 'static', 'qr', f"{dev_id}.png")
    assert os.path.exists(qr_image_path)

    if os.path.exists(qr_image_path):
        os.remove(qr_image_path)


def test_remove_qr(client, app):
    with app.app_context():
        device: Device = Device.query.first()

    dev_id = device.dev_id
    generate_qr(dev_id, testing=True)

    qr_image_path = os.path.join(os.getcwd(), 'static', 'qr', f"{dev_id}.png")

    remove_qr(dev_id)

    assert not os.path.exists(qr_image_path)
