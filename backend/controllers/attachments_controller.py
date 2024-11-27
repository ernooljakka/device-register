import os
from flask import jsonify, request, Response
from werkzeug.utils import secure_filename
from backend.models.device_model import Device
from backend.utils.check_admin import it_is_admin
from backend.utils.config import config
from typing import Union


allowed_mime_types = {'application/pdf', 'image/png', 'image/jpeg', 'text/csv'}


def allowed_mime_type(file):
    return file.mimetype in allowed_mime_types


def is_device_valid(dev_id: int) -> bool:
    return Device.get_device_by_id(dev_id) is not None


def get_files_from_request():
    if 'files' not in request.files:
        return None
    files = request.files.getlist('files')
    return files if len(files) > 0 else None


def is_admin_or_single_file(files: list) -> bool:
    return len(files) <= 1 or it_is_admin()


def get_device_attachment_directory(dev_id: int) -> str:
    return os.path.join(
        config.PROJECT_ROOT, 'backend', 'static', 'attachments', str(dev_id)
    )


def create_attachment_directory(dev_id: int) -> Union[str, None]:
    device_attachment_directory = get_device_attachment_directory(dev_id)
    try:
        os.makedirs(device_attachment_directory, exist_ok=True)
        return device_attachment_directory
    except OSError:
        return None


def is_file_size_valid(file) -> bool:
    max_size_bytes = config.ATTACHMENT_MAX_SIZE_MB * 1024 * 1024
    file.seek(0, os.SEEK_END)
    size = file.tell()
    file.seek(0)
    return size <= max_size_bytes


def save_file(file, directory: str) -> Union[str, None]:
    safe_filename = secure_filename(file.filename)
    file_path = os.path.join(directory, safe_filename)

    if os.path.exists(file_path):
        return None

    try:
        file.save(file_path)
        return safe_filename
    except (OSError, IOError) as e:
        print(f"Error saving file '{safe_filename}': {str(e)}")
        return None


def get_current_file_count(dev_id: int) -> int:
    device_attachment_directory = get_device_attachment_directory(dev_id)
    if os.path.exists(device_attachment_directory):
        return len(os.listdir(device_attachment_directory))
    return 0


def upload_files(dev_id: int) -> tuple[Response, int]:
    if not is_device_valid(dev_id):
        return jsonify({"error": "Device not found"}), 404

    files = get_files_from_request()
    if not files:
        return jsonify({"error": "No files uploaded"}), 400

    current_file_count = get_current_file_count(dev_id)
    if current_file_count + len(files) > config.MAX_ATTACHMENT_COUNT:
        return jsonify(
            {
                "error": (
                    f"Device can only have a maximum of "
                    f"{config.MAX_ATTACHMENT_COUNT} files"
                )
            }
        ), 400

    if not is_admin_or_single_file(files):
        return jsonify(
            {"error": "Only admin allowed to add multiple attachments in one request"}
        ), 401

    device_attachment_directory = create_attachment_directory(dev_id)
    if not device_attachment_directory:
        return jsonify({"error": "Failed to create attachment directory"}), 500

    saved_files = []
    for file in files:
        if not is_file_size_valid(file):
            return jsonify(
                {"error": f"File '{file.filename}' exceeds the maximum allowed size"}
            ), 400

        if not allowed_mime_type(file):
            return jsonify(
                {"error": f"File '{file.filename}' type not allowed"}
            ), 400

        saved_filename = save_file(file, device_attachment_directory)
        if not saved_filename:
            return jsonify(
                {"error": f"File '{file.filename}' already exists or failed to save"}
            ), 400

        saved_files.append(saved_filename)

    return jsonify({
        "message": "Files uploaded successfully", "files": saved_files
    }), 200


def get_all_files_in_directory(directory_path: str) -> list[str]:
    try:
        all_items = os.listdir(directory_path)
        files = [
            item for item in all_items
            if os.path.isfile(os.path.join(directory_path, item))
        ]
        return files
    except OSError as e:
        print(f"Error accessing directory: {e}")
        return []


def list_files(dev_id: int) -> tuple[Response, int]:
    device_attachment_directory = get_device_attachment_directory(dev_id)

    if not os.path.exists(device_attachment_directory):
        return jsonify({"error": "Directory not found"}), 404

    all_files = get_all_files_in_directory(device_attachment_directory)

    # Check if there were any issues accessing the files
    if not all_files:
        return jsonify({"message": "No files found in the directory"}), 200

    file_urls = [f"/static/attachments/{dev_id}/{file}" for file in all_files]

    return (jsonify({"message": "Files retrieved successfully", "files": file_urls}),
            200)


def remove_attachments(dev_id: int):
    device_attachment_directory = get_device_attachment_directory(dev_id)

    if os.path.exists(device_attachment_directory):
        for filename in os.listdir(device_attachment_directory):
            file_path = os.path.join(device_attachment_directory, filename)
            if os.path.isfile(file_path):
                os.remove(file_path)

        # After all files are removed, remove the directory itself
        os.rmdir(device_attachment_directory)


def remove_file(dev_id: int, file_name: str) -> tuple[Response, int]:
    if not it_is_admin():
        return jsonify({"error": "Unauthorized access"}), 401

    device_attachment_directory = get_device_attachment_directory(dev_id)

    if not os.path.exists(device_attachment_directory):
        return jsonify({"error": "Directory not found"}), 404

    file_path = os.path.join(device_attachment_directory, file_name)

    if not os.path.exists(file_path):
        return jsonify({"error": "File not found in the directory"}), 404

    try:
        os.remove(file_path)
    except OSError as e:
        return jsonify({"error": "Failed to delete the file", "details": str(e)}), 500

    return jsonify({"message": "File deleted successfully"}), 200
