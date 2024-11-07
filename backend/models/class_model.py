from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import validates

from backend.setup.database_Init import db


class Class(db.Model):
    __tablename__ = 'classes'

    @validates('class_name')
    def validate_length(self, key, data):
        max_lengths = {
            'class_name': 50
        }
        if len(data) > max_lengths[key]:
            return data[:max_lengths[key]]
        return data

    class_id = db.Column(db.Integer, primary_key=True)
    class_name = db.Column(db.String, nullable=False, unique=True)

    devices = db.relationship(
        'Device',
        backref='device_class',
        lazy=True
    )

    def to_dict(self) -> dict[str, str]:
        return {
            'class_id': str(self.class_id),
            'class_name': self.class_name
        }

    @staticmethod
    def get_all() -> list['Class']:
        return Class.query.all()

    @staticmethod
    def create_class(class_name: str) -> tuple[int, str]:
        new_class = Class(class_name=class_name)
        try:
            db.session.add(new_class)
            db.session.commit()
            return 201, f"Created successfully class {class_name}"
        except IntegrityError:
            db.session.rollback()
            return 409, f"Class named {class_name} already exists"
        except Exception as e:
            db.session.rollback()
            return 500, str(e)

    @staticmethod
    def remove_class_by_id(class_id: int) -> tuple[int, str]:
        class_found = db.session.get(Class, class_id)

        if not class_found:
            return 404, f"Class with id {class_id} could not be found"

        try:
            db.session.delete(class_found)
            db.session.commit()
            return 200, (f"Deleted successfully class {class_id} "
                         f"{class_found.class_name}")
        except IntegrityError:
            db.session.rollback()
            return 409, "Cannot delete a class that is associated with devices."
        except Exception as e:
            db.session.rollback()
            return 500, str(e)
