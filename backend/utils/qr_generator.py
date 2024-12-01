import qrcode
import os

from backend.models.device_model import Device
from backend.utils.config import config

QR_FOLDER = os.path.join(config.PROJECT_ROOT, 'backend', 'static', 'qr')

os.makedirs(QR_FOLDER, exist_ok=True)


def generate_qr(device_id: int):
    front_base_url: str = config.FRONTEND_ADDR+config.FRONTEND_BASEPATH
    device_url: str = f"{front_base_url}devices/{device_id}/move"
    qr_image = qrcode.make(device_url)
    qr_image.save(qr_path(device_id))


def remove_qr(device_id: int):
    qr_image_path = qr_path(device_id)
    if os.path.exists(qr_image_path):
        os.remove(qr_image_path)


def qr_path(device_id: int):
    return os.path.join(QR_FOLDER, f"{device_id}.png")


def recreate_qr_codes():
    all_devices: list[Device] = Device.get_all()
    device_id_list = [dev.dev_id for dev in all_devices]

    for device_id in device_id_list:
        generate_qr(device_id)
