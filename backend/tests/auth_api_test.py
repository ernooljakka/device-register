import pytest
from datetime import timedelta
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash
from backend.app import create_app


@pytest.fixture
def app():
    # Create and configure a new app instance for each test.
    app = create_app(testing=True)
    app.config['JWT_SECRET_KEY'] = "test_secret_key"

    yield app


@pytest.fixture
def client(app):
    # A tests client for the app.
    return app.test_client()


def test_login(client, mocker):
    hashed_password = generate_password_hash("test_password")
    mocker.patch('backend.controllers.auth_controller.get_admin_credentials',
                 return_value=('test_admin', hashed_password))

    payload1 = {
        "username": "test_admin",
        "password": "test_password"
    }
    response1 = client.post('/api/auth/login', json=payload1)
    assert response1.status_code == 200

    payload2 = {
        "username": "wrong_username",
        "password": "test_password"
    }
    response2 = client.post('/api/auth/login', json=payload2)
    assert response2.status_code == 401

    payload3 = {
        "username": "test_admin",
        "password": "wrong_password"
    }
    response3 = client.post('/api/auth/login', json=payload3)
    assert response3.status_code == 401

    payload4 = {
        "wrong_field": "test_admin",
        "password": "test_password"
    }
    response4 = client.post('/api/auth/login', json=payload4)
    assert response4.status_code == 400

    payload5 = {
        "username": "test_admin"
    }
    response5 = client.post('/api/auth/login', json=payload5)
    assert response5.status_code == 400


def test_is_admin(app, client, mocker):
    mocker.patch('backend.controllers.auth_controller.get_admin_credentials',
                 return_value=('test_admin', 'hashed_password'))

    with app.app_context():
        valid_access_token = create_access_token(identity="test_admin")

    response1 = client.get('/api/auth/admin', headers={
        "Authorization": f"Bearer {valid_access_token}"
    })
    assert response1.status_code == 200

    response2 = client.get('/api/auth/admin')
    assert response2.status_code == 401

    malformed_token = "malformed.token.value"
    response3 = client.get('/api/auth/admin', headers={
        "Authorization": f"Bearer {malformed_token}"
    })
    assert response3.status_code == 422

    tampered_token = f"{valid_access_token}tampered"
    response4 = client.get('/api/auth/admin', headers={
        "Authorization": f"Bearer {tampered_token}"
    })
    assert response4.status_code == 422

    with app.app_context():
        expired_token = create_access_token(identity="test_admin",
                                            expires_delta=timedelta(seconds=-1))

    response5 = client.get('/api/auth/admin', headers={
        "Authorization": f"Bearer {expired_token}"
    })
    assert response5.status_code == 401
