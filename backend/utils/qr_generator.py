from flask import request
import qrcode
import os


QR_FOLDER = os.path.join(os.getcwd(), 'static', 'qr')

os.makedirs(QR_FOLDER, exist_ok=True)


def generate_qr(device_id: int, testing=False):
    if testing:
        base_url = 'http://localhost/'
    else:
        base_url = request.url_root.rstrip('/')

    device_url = f"{base_url}/devices/{device_id}/move"

    qr_image = qrcode.make(device_url)

    qr_image.save(qr_path(device_id))


def remove_qr(device_id: int):
    qr_image_path = qr_path(device_id)

    if os.path.exists(qr_image_path):
        os.remove(qr_image_path)


def qr_path(device_id: int):
    return os.path.join(QR_FOLDER, f"{device_id}.png")
