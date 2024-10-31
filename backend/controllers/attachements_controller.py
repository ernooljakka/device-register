import os
from flask import jsonify, request, Response
from backend.models.device_model import Device
from werkzeug.utils import secure_filename


allowed_mime_types = {'application/pdf', 'image/png', 'image/jpeg'}


def allowed_mime_type(file):
    return file.mimetype in allowed_mime_types


def upload_files(dev_id: int) -> tuple[Response, int]:
    if Device.get_device_by_id(dev_id) is None:
        return jsonify({"error": "Device not found"}), 404

    if 'files' not in request.files:
        return jsonify({"error": "No files part in the request"}), 400

    files = request.files.getlist('files')
    if len(files) == 0:
        return jsonify({"error": "No files uploaded"}), 400

    device_attachment_directory = os.path.join('static', 'attachments', str(dev_id))

    # Create the directory if it does not exist
    try:
        os.makedirs(device_attachment_directory, exist_ok=True)
    except OSError as e:
        return jsonify({"error": f"Failed to create directory: {str(e)}"}), 500

    saved_files = []
    for file in files:
        if allowed_mime_type(file):
            safe_filename = secure_filename(file.filename)
            file_path = os.path.join(device_attachment_directory, safe_filename)

            if os.path.exists(file_path):
                return jsonify({"error": f"File '{safe_filename}' already exists"}), 400

            try:
                file.save(file_path)
                saved_files.append(safe_filename)
            except Exception as e:
                return jsonify(
                    {"error": f"Failed to save file '{safe_filename}': {str(e)}"}), 500
        else:
            return jsonify({"error": f"File '{file.filename}' type not allowed"}), 400

    return (jsonify({"message": "Files uploaded successfully", "files": saved_files}),
            200)
