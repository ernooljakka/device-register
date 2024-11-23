import pytest
from backend.app import create_app
from backend.setup.database_Init import db
from backend.models.class_model import Class
from backend.models.device_model import Device
from flask_jwt_extended import create_access_token


@pytest.fixture
def app():
    # Create and configure a new app instance for each test.
    app = create_app(env_config_file=".env.development")

    with app.app_context():
        db.create_all()

        test_class1: Class = Class(class_name="A")
        test_class2: Class = Class(class_name="B")
        test_device: Device = Device(
            dev_name="iDevice",
            dev_manufacturer="iManufacturer",
            dev_model="iModel",
            dev_home="iHome",
            class_id=2,
            dev_comments="Location: iLab")
        db.session.add(test_class1)
        db.session.add(test_class2)
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


def test_class_to_dict(app):
    with app.app_context():
        test_class = Class.query.first()

        class_dict = test_class.to_dict()

        assert class_dict['class_id'] == "1"
        assert class_dict['class_name'] == "A"


def test_get_all_classes(client):
    response = client.get('/api/classes/')

    assert response.status_code == 200

    class_list = response.get_json()
    assert len(class_list) == 2
    assert class_list[0]['class_name'] == 'A'
    assert class_list[1]['class_name'] == 'B'


def test_post_class(client, app, auth_header):
    response1 = client.post('/api/classes/',
                            json={"class_name": "C"},
                            headers=auth_header)
    assert response1.status_code == 201

    with app.app_context():
        classes = Class.query.all()
        assert len(classes) == 3

    response2 = client.post('/api/classes/',
                            json=[],
                            headers=auth_header)
    assert response2.status_code == 400

    response3 = client.post('/api/classes/',
                            json={"wrong_field": "E"},
                            headers=auth_header)
    assert response3.status_code == 400

    response4 = client.post('/api/classes/',
                            json={"class_name": 6},
                            headers=auth_header)
    assert response4.status_code == 400

    response5 = client.post('/api/classes/',
                            json={"class_name": "A"},
                            headers=auth_header)
    assert response5.status_code == 409

    response6 = client.post('/api/classes/',
                            json={"class_name": "C"})
    assert response6.status_code == 401


def test_delete_class(client, app, auth_header):
    response1 = client.delete('/api/classes/1', headers=auth_header)
    assert response1.status_code == 200

    response2 = client.delete('/api/classes/1', headers=auth_header)
    assert response2.status_code == 404

    response3 = client.delete('/api/classes/9999', headers=auth_header)
    assert response3.status_code == 404

    response4 = client.delete('/api/classes/2', headers=auth_header)
    assert response4.status_code == 409

    response5 = client.delete('/api/classes/1')
    assert response5.status_code == 401

    with app.app_context():
        classes = Class.query.all()
        assert len(classes) == 1
