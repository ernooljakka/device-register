from typing import Union

from backend.setup.database_Init import db
from backend.models.event_model import Event
from sqlalchemy import delete
from sqlalchemy.exc import SQLAlchemyError


class Device(db.Model):
    __tablename__ = 'devices'

    dev_id = db.Column(db.Integer, primary_key=True)
    dev_name = db.Column(db.String(100), nullable=False)
    dev_manufacturer = db.Column(db.String(50), nullable=False)
    dev_model = db.Column(db.String(50), nullable=False)
    dev_class = db.Column(db.String(50), nullable=False)
    dev_comments = db.Column(db.String(200), nullable=False)

    events = db.relationship('Event', backref='device', lazy=True)

    def to_dict(self) -> dict[str, str]:
        return {
            'dev_id': str(self.dev_id),
            'dev_name': self.dev_name,
            'dev_manufacturer': self.dev_manufacturer,
            'dev_model': self.dev_model,
            'dev_class': self.dev_class,
            'dev_comments': self.dev_comments
        }

    @staticmethod
    def get_all() -> list['Device']:
        return Device.query.all()

    @staticmethod
    def create_devices(device_list: list['Device']) -> tuple['bool', 'str']:
        try:
            with db.session.begin():
                for new_device in device_list:
                    db.session.add(new_device)

        except SQLAlchemyError as error:
            db.session.rollback()
            return False, str(error)

        return True, ""

    @staticmethod
    def get_device_by_id(dev_id: int) -> 'Device':
        return db.session.get(Device, dev_id)

    @staticmethod
    def update_device_by_id(dev_id: int, device_data: Union[dict[str, str, int]]
                            ) -> tuple['Device', bool]:
        existing_device = Device.get_device_by_id(dev_id)

        if existing_device:
            for key, value in device_data.items():
                setattr(existing_device, key, value)
            db.session.commit()
            return existing_device, True
        else:
            return existing_device, False

    @staticmethod
    def remove_devices(id_list: list['int']) -> tuple['int', 'str']:
        try:
            del_stmt = delete(Device).where(Device.dev_id.in_(id_list))
            result = db.session.execute(del_stmt)

            if result.rowcount == 0:
                return 404, "No devices found with provided ids"

            db.session.commit()
            return 200, ''

        except SQLAlchemyError as error:
            db.session.rollback()
            return 500, str(error)

    @staticmethod
    def get_events_by_device_id(dev_id: int) -> Union[tuple[list['Event'], None, int]]:
        device = Device.get_device_by_id(dev_id)
        if device:
            return device.events, 200
        return None, 404

    @staticmethod
    def get_current_locations() -> list[dict[str, Union[str, None]]]:
        latest_event_subquery = (
            db.session.query(
                Event.dev_id,
                db.func.max(Event.move_time).label('latest_time')
            )
            .group_by(Event.dev_id)
            .subquery()
        )

        latest_event = db.aliased(Event)

        results = (
            db.session.query(
                Device,
                latest_event.loc_name,
                latest_event.move_time
            )
            .outerjoin(
                latest_event_subquery,
                Device.dev_id == latest_event_subquery.c.dev_id
            )
            .outerjoin(
                latest_event,
                (Device.dev_id == latest_event.dev_id) &
                (latest_event.move_time == latest_event_subquery.c.latest_time)
            )
            .all()
        )

        devices_with_locations = [
            {
                "device_id": str(device.dev_id),
                "device_name": device.dev_name,
                "device_model": device.dev_model,
                "dev_manufacturer": device.dev_manufacturer,
                "loc_name": loc_name,
                "move_time": move_time.isoformat() if move_time else None
            }
            for device, loc_name, move_time in results
        ]

        return devices_with_locations
