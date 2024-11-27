import os
import pytest
from backend.app import create_app
from backend.models.class_model import Class
from backend.setup.database_Init import db
from backend.models.device_model import Device
from backend.utils.config import config
from flask_jwt_extended import create_access_token


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


@pytest.fixture
def auth_header(app):
    with app.app_context():
        access_token = create_access_token(identity="admin")
        return {"Authorization": f"Bearer {access_token}"}


@pytest.fixture
def non_admin_header(app):
    with app.app_context():
        access_token = create_access_token(identity="tester")  # Non-admin user
        return {"Authorization": f"Bearer {access_token}"}


def test_upload_files(client, app):
    # Test the POST /api/attachments/upload/<dev_id> endpoint.
    test_file_directory: str = os.path.join(
        config.PROJECT_ROOT,
        'backend', 'tests', 'static', 'attachments', 'test_files'
    )

    device_attachment_directory: str = os.path.join(
        config.PROJECT_ROOT,
        'backend',  'static', 'attachments', '1'
    )

    # Uploading to a non-existent device
    with open(os.path.join(test_file_directory, 'cat.jpg'), 'rb') as file:
        response_invalid_device = client.post('api/attachments/upload/2',
                                              data={'files': (file, 'cat.jpg')})
    assert response_invalid_device.status_code == 404

    # Uploading a valid file (JPG)
    with open(os.path.join(test_file_directory, 'cat.jpg'), 'rb') as file:
        response_valid_file = client.post('api/attachments/upload/1',
                                          data={'files': (file, 'cat.jpg')})
    assert response_valid_file.status_code == 200

    # Sending a request with no files
    response_no_files = client.post('api/attachments/upload/1', data={})
    assert response_no_files.status_code == 400

    # Uploading an unsupported file type (bin)
    with open(os.path.join(test_file_directory, 'not_supported.bin'), 'rb') as file:
        response_invalid_file_type = client.post(
            'api/attachments/upload/1',
            data={'files': (file, 'not_supported.bin')}
        )
    assert response_invalid_file_type.status_code == 400

    # Uploading a file that exceeds the size limit
    over_30_pdf_path = os.path.join(test_file_directory, 'over_30.pdf')

    # Ensure the file is over 30MB
    with open(over_30_pdf_path, 'rb') as file:
        response_large_pdf = client.post(
            '/api/attachments/upload/1',
            data={'files': (file, 'over_30.pdf')}
        )
    assert response_large_pdf.status_code == 400
    assert (response_large_pdf.json['error'] ==
            "File 'over_30.pdf' exceeds the maximum allowed size")

    # Clean up the uploaded files
    if os.path.exists(device_attachment_directory):
        for filename in os.listdir(device_attachment_directory):
            file_path = os.path.join(device_attachment_directory, filename)
            if os.path.isfile(file_path):
                os.remove(file_path)
        os.rmdir(device_attachment_directory)


def test_get_files(client, app):
    # Test the GET /api/attachments/list/<dev_id> endpoint.
    test_file_directory: str = os.path.join(
        config.PROJECT_ROOT,
        'backend', 'tests', 'static', 'attachments', 'test_files'
    )

    device_attachment_directory: str = os.path.join(
        config.PROJECT_ROOT,
        'backend', 'static', 'attachments', '1'
    )

    os.makedirs(device_attachment_directory, exist_ok=True)
    test_file_path = os.path.join(test_file_directory, 'cat.jpg')
    device_file_path = os.path.join(device_attachment_directory, 'cat.jpg')

    # Simulate file upload by copying the test file to the device directory
    with open(test_file_path, 'rb') as f:
        file_data = f.read()
    with open(device_file_path, 'wb') as f:
        f.write(file_data)

    # Test retrieving files from an existing device
    response_valid_device = client.get('api/attachments/list/1')
    assert response_valid_device.status_code == 200
    assert ('Files retrieved successfully' in
            response_valid_device.get_json()['message'])
    assert ('/static/attachments/1/cat.jpg' in
            response_valid_device.get_json()['files'])

    # Test retrieving files from a non-existent device
    response_invalid_device = client.get('api/attachments/list/2')
    assert response_invalid_device.status_code == 404
    assert ('Directory not found' in
            response_invalid_device.get_json()['error'])

    # Clean up the uploaded test files and the directory
    if os.path.exists(device_attachment_directory):
        for filename in os.listdir(device_attachment_directory):
            file_path = os.path.join(device_attachment_directory, filename)
            if os.path.isfile(file_path):
                os.remove(file_path)
        os.rmdir(device_attachment_directory)


def test_delete_file(client, app, auth_header, non_admin_header):
    test_file_directory: str = os.path.join(
        config.PROJECT_ROOT,
        'backend', 'tests', 'static', 'attachments', 'test_files'
    )

    device_attachment_directory: str = os.path.join(
        config.PROJECT_ROOT,
        'backend', 'static', 'attachments', '1'
    )

    os.makedirs(device_attachment_directory, exist_ok=True)
    test_file_path = os.path.join(test_file_directory, 'cat.jpg')
    device_file_path = os.path.join(device_attachment_directory, 'cat.jpg')

    # Simulate file upload by copying the test file to the device directory
    with open(test_file_path, 'rb') as f:
        file_data = f.read()
    with open(device_file_path, 'wb') as f:
        f.write(file_data)

    # Ensure the file exists before attempting deletion
    assert os.path.exists(device_file_path)

    # Valid delete request
    response_valid_delete = client.delete('/api/attachments/delete/1/cat.jpg',
                                          headers=auth_header)
    assert response_valid_delete.status_code == 200
    assert response_valid_delete.json['message'] == "File deleted successfully"

    assert not os.path.exists(device_file_path)

    # Attempt deletion on a non-existent device directory
    response_nonexistent_device = client.delete('/api/attachments/delete/2/cat.jpg',
                                                headers=auth_header)
    assert response_nonexistent_device.status_code == 404
    assert response_nonexistent_device.json['error'] == "Directory not found"

    # Attempt deletion with a non-existent file in an existing directory
    response_nonexistent_file = client.delete('/api/attachments/delete/1/dog.jpg',
                                              headers=auth_header)
    assert response_nonexistent_file.status_code == 404
    assert response_nonexistent_file.json['error'] == "File not found in the directory"

    # Unauthorized delete request with non-admin token
    response_unauthorized_delete = client.delete('/api/attachments/delete/1/cat.jpg',
                                                 headers=non_admin_header)
    assert response_unauthorized_delete.status_code == 401
    assert response_unauthorized_delete.json['error'] == "Unauthorized access"
