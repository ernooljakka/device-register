import pytest
import os

from backend.app import create_app
from backend.utils.config import config
from backend.models.device_model import Device
from backend.models.class_model import Class
from backend.setup.database_Init import db
from backend.controllers.attachments_controller import remove_attachments


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

    # Clean up / reset the database after each test
    with app.app_context():
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    # A tests client for the app.
    return app.test_client()


def test_remove_attachments(client, app):
    # Test remove_attachments from attachments controller
    with app.app_context():
        device: Device = Device.query.first()

    dev_id = device.dev_id
    device_attachment_directory = os.path.join(
        config.PROJECT_ROOT, 'backend', 'static', 'attachments', str(dev_id)
    )

    os.makedirs(device_attachment_directory, exist_ok=True)
    test_file_path = os.path.join(device_attachment_directory, 'test_attachment.txt')

    with open(test_file_path, 'w') as f:
        f.write('This is a test attachment.')

    assert os.path.exists(test_file_path)

    remove_attachments(dev_id)

    assert not os.path.exists(device_attachment_directory)
    # This may be redundant since the directory check should suffice
    assert not os.path.exists(test_file_path)
