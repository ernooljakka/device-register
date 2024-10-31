import pytest
from backend.app import create_app
from backend.setup.database_Init import db
from backend.models.user_model import User


@pytest.fixture
def app():
    # Create and configure a new app instance for each test.
    app = create_app(env_config_file=".env.development")

    with app.app_context():
        db.create_all()
        # Add a test user to the database
        test_user: User = User(user_name="User xyz", user_email="user@email.com")
        db.session.add(test_user)
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


def test_user_to_dict(app):
    with app.app_context():
        user = User.query.first()

        user_dict = user.to_dict()

        assert user_dict['user_id'] == str(user.user_id)
        assert user_dict['user_name'] == user.user_name
        assert user_dict['user_email'] == user.user_email


def test_get_all_users(client):
    # Test the GET /api/users endpoint.
    response = client.get('/api/users/')
    assert response.status_code == 200

    data = response.get_json()
    assert len(data) == 1
    assert data[0]['user_name'] == "User xyz"
    assert data[0]['user_email'] == "user@email.com"


def test_get_user_by_id(client):
    # Test the GET /api/users/int:user_id endpoint.
    response = client.get('/api/users/1')
    assert response.status_code == 200

    data = response.get_json()
    assert data['user_id'] == "1"
    assert data['user_name'] == "User xyz"
    assert data['user_email'] == "user@email.com"

    response_404 = client.get('/api/users/9999')
    assert response_404.status_code == 404
