from typing import List, Dict
from backend.utils.database_Init import db


class Device(db.Model):
    __tablename__ = 'devices'

    dev_id = db.Column(db.Integer, primary_key=True)
    dev_name = db.Column(db.String(100), nullable=False)
    dev_type = db.Column(db.String(50), nullable=False)
    dev_serial = db.Column(db.String(100), nullable=False)

    def to_dict(self) -> Dict[str, str]:
        return {
            'dev_id': str(self.dev_id),
            'dev_name': self.dev_name,
            'dev_type': self.dev_type,
            'dev_serial': self.dev_serial,
        }

    @staticmethod
    def get_all() -> List['Device']:
        return Device.query.all()
