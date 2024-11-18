from typing import Union

from backend.setup.database_Init import db
from backend.models.class_model import Class
from backend.models.event_model import Event
from sqlalchemy import delete
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import joinedload, validates


class Device(db.Model):
    __tablename__ = 'devices'

    @validates('dev_name', 'dev_manufacturer', 'dev_model', 'dev_comments')
    def validate_length(self, key, data):
        max_lengths = {
            'dev_name': 100,
            'dev_manufacturer': 50,
            'dev_model': 50,
            'dev_comments': 200
        }
        if len(data) > max_lengths[key]:
            return data[:max_lengths[key]]
        return data

    dev_id = db.Column(db.Integer, primary_key=True)
    dev_name = db.Column(db.String, nullable=False)
    dev_manufacturer = db.Column(db.String, nullable=False)
    dev_model = db.Column(db.String, nullable=False)
    class_id = db.Column(db.Integer,
                         db.ForeignKey('classes.class_id'),
                         nullable=False)
    dev_comments = db.Column(db.String, nullable=False)

    events = db.relationship(
        'Event',
        backref='device',
        lazy=True,
        cascade='all, delete-orphan',
        passive_deletes=True
    )

    def to_dict(self) -> dict[str, str]:
        return {
            'dev_id': str(self.dev_id),
            'dev_name': self.dev_name,
            'dev_manufacturer': self.dev_manufacturer,
            'dev_model': self.dev_model,
            'class_name': self.device_class.class_name,
            'dev_comments': self.dev_comments
        }

    @staticmethod
    def get_all() -> list['Device']:
        return (db.session.query(Device)
                .options(joinedload(Device.device_class))
                .all())

    @staticmethod
    def create_devices(device_list: list['Device']) -> tuple['bool', 'str']:
        try:
            db.session.add_all(device_list)
            db.session.commit()

        except SQLAlchemyError as error:
            db.session.rollback()
            return False, str(error)

        return True, ""

    @staticmethod
    def get_device_by_id(dev_id: int) -> 'Device':
        return (db.session.query(Device)
                .options(joinedload(Device.device_class))
                .filter_by(dev_id=dev_id)
                .first())

    @staticmethod
    def update_device_by_id(dev_id: int, device_data: Union[dict[str, str, int]]
                            ) -> tuple[Union['Device', str], int]:
        existing_device = Device.get_device_by_id(dev_id)

        if not existing_device:
            return existing_device, 404

        try:
            for key, value in device_data.items():
                setattr(existing_device, key, value)
            db.session.commit()
        except IntegrityError as error:
            db.session.rollback()
            return str(error), 500

        return existing_device, 0

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
    def get_events_by_device_id(dev_id: int)\
            -> Union[tuple[list[dict], int], tuple[str, int]]:
        device = db.session.query(Device).options(
            joinedload(Device.events)
            .joinedload(Event.user)
        ).filter_by(dev_id=dev_id).first()

        if not device:
            return "Device not found", 404
        if device.events:
            events = device.events
            events_with_user_name = [
                {**event.to_dict(), 'user_name': event.user.user_name}
                for event in events
            ]
            return events_with_user_name, 200
        else:
            return f"Events not found for device {dev_id}", 404

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
                Class.class_name,
                latest_event.loc_name,
                latest_event.move_time
            )
            .join(Class, Device.class_id == Class.class_id)
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
                "dev_id": str(device.dev_id),
                "dev_name": device.dev_name,
                "dev_model": device.dev_model,
                "dev_manufacturer": device.dev_manufacturer,
                "class_name": class_name,
                "loc_name": loc_name,
                "move_time": move_time.isoformat() if move_time else None
            }
            for device, class_name, loc_name, move_time in results
        ]

        return devices_with_locations
