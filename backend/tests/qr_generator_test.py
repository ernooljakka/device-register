import os
import pytest
from backend.app import create_app
from backend.setup.database_Init import db
from backend.models.class_model import Class
from backend.models.device_model import Device
from backend.utils.config import config
from backend.utils.qr_generator import generate_qr, remove_qr, recreate_qr_codes


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

        # Add a tests device to the database
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


def test_generate_qr(client, app):
    with app.app_context():
        device: Device = Device.query.first()

    dev_id = device.dev_id
    generate_qr(dev_id)

    qr_image_path = os.path.join(
        config.PROJECT_ROOT, 'backend', 'static', 'qr', f"{dev_id}.png")

    assert os.path.isfile(qr_image_path)

    if os.path.exists(qr_image_path):
        os.remove(qr_image_path)


def test_remove_qr(client, app):
    with app.app_context():
        device: Device = Device.query.first()

    dev_id = device.dev_id
    generate_qr(dev_id)

    qr_image_path = os.path.join(
        config.PROJECT_ROOT, 'backend', 'static', 'qr', f"{dev_id}.png")

    remove_qr(dev_id)

    assert not os.path.exists(qr_image_path)


def test_recreate_qr_codes(client, app):
    with app.app_context():
        test_device1: Device = Device.query.first()

        test_device2: Device = Device(
            dev_name="Device",
            dev_manufacturer="Manfact A",
            dev_model="Model S",
            dev_home="Home",
            class_id=1,
            dev_comments="Location: Herwood xyz")
        test_device3: Device = Device(
            dev_name="Device",
            dev_manufacturer="Manfact A",
            dev_model="Model S",
            dev_home="Home",
            class_id=1,
            dev_comments="Location: Herwood xyz")
        db.session.add(test_device2)
        db.session.add(test_device3)
        db.session.commit()

        dev1_id = test_device1.dev_id
        dev2_id = test_device2.dev_id
        dev3_id = test_device3.dev_id

    qr_image_1_path = os.path.join(
        config.PROJECT_ROOT, 'backend', 'static', 'qr', f"{dev1_id}.png")
    qr_image_2_path = os.path.join(
        config.PROJECT_ROOT, 'backend', 'static', 'qr', f"{dev2_id}.png")
    qr_image_3_path = os.path.join(
        config.PROJECT_ROOT, 'backend', 'static', 'qr', f"{dev3_id}.png")

    if os.path.exists(qr_image_1_path):
        os.remove(qr_image_1_path)
    if os.path.exists(qr_image_2_path):
        os.remove(qr_image_2_path)
    if os.path.exists(qr_image_3_path):
        os.remove(qr_image_3_path)

    with app.app_context():
        recreate_qr_codes()

    assert os.path.isfile(qr_image_1_path)
    assert os.path.isfile(qr_image_2_path)
    assert os.path.isfile(qr_image_3_path)
