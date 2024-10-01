import pytest
from backend.app import create_app
from backend.utils.database_Init import db
from backend.models.user_model import User
from backend.controllers.user_controller import (add_or_update_user,
                                                 get_user_by_id,
                                                 get_all_users)


@pytest.fixture
def app():
    # Create and configure a new app instance for each test.
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    with app.app_context():
        db.create_all()
        # Add a test user to the database
        test_user = User(user_name="User xyz", user_email="user@email.com")
        db.session.add(test_user)
        db.session.commit()

        yield app

    # Clean up / reset the database after each test
    with app.app_context():
        db.session.remove()
        db.drop_all()


@pytest.fixture
def app_context(app):
    with app.app_context():
        yield app


def test_add_or_update_user(app_context):
    # Test adding a new user by directly calling the controller function.
    new_user_data = {
        "user_name": "New User",
        "user_email": "newuser@email.com"
    }

    # Call the controller function directly
    response, status_code = add_or_update_user(new_user_data)

    # Assert that the response is correct
    assert status_code == 201
    assert response.json['user_name'] == new_user_data['user_name']
    assert response.json['user_email'] == new_user_data['user_email']

    # Test updating an existing user
    updated_user_data = {
        "user_name": "Updated User",
        "user_email": "newuser@email.com"
    }

    # Since we don't pass a user_id, it will update based on email
    response, status_code = add_or_update_user(updated_user_data)
    assert status_code == 200
    assert response.json['user_name'] == updated_user_data['user_name']


def test_get_user_by_id(app_context):
    # Get the user that was added in the fixture by directly calling the controller.
    response, status_code = get_user_by_id(1)

    # Assert that the user is found
    assert status_code == 200
    assert response.json['user_name'] == "User xyz"
    assert response.json['user_email'] == "user@email.com"

    # Test non-existent user
    response, status_code = get_user_by_id(9999)
    assert status_code == 404
    assert response.json['error'] == "User not found"


def test_get_all_users(app_context):
    # Test fetching all users
    response, status_code = get_all_users()

    # Assert that one user is found (added in the fixture)
    assert status_code == 200
    assert len(response.json) == 1
    assert response.json[0]['user_name'] == "User xyz"
    assert response.json[0]['user_email'] == "user@email.com"
