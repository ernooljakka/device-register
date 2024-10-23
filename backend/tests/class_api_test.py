import pytest
from backend.app import create_app
from backend.setup.database_Init import db
from backend.models.class_model import Class


@pytest.fixture
def app():
    # Create and configure a new app instance for each test.
    app = create_app(testing=True)

    with app.app_context():
        db.create_all()

        test_class1: Class = Class(class_name="A")
        test_class2: Class = Class(class_name="B")
        db.session.add(test_class1)
        db.session.add(test_class2)
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


def test_post_class(client, app):
    response1 = client.post('/api/classes/', json={"class_name": "C"})
    assert response1.status_code == 201

    with app.app_context():
        classes = Class.query.all()
        assert len(classes) == 3

    response2 = client.post('/api/classes/', json=[])
    assert response2.status_code == 400

    response3 = client.post('/api/classes/', json={"wrong_field": "E"})
    assert response3.status_code == 400

    response4 = client.post('/api/classes/', json={"class_name": 6})
    assert response4.status_code == 400

    response5 = client.post('/api/classes/', json={"class_name": "A"})
    assert response5.status_code == 409


def test_delete_class(client, app):
    response1 = client.delete('/api/classes/1')
    assert response1.status_code == 200

    response2 = client.delete('/api/classes/1')
    assert response2.status_code == 404

    response3 = client.delete('/api/classes/9999')
    assert response3.status_code == 404

    with app.app_context():
        classes = Class.query.all()
        assert len(classes) == 1
