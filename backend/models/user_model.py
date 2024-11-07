from typing import Union

from sqlalchemy.orm import validates

from backend.setup.database_Init import db


class User(db.Model):
    __tablename__ = 'users'

    @validates('user_name', 'user_email')
    def validate_length(self, key, data):
        max_lengths = {
            'user_name': 100,
            'user_email': 50
        }
        if len(data) > max_lengths[key]:
            return data[:max_lengths[key]]
        return data

    user_id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String, nullable=False)
    user_email = db.Column(db.String, nullable=False, unique=True)

    events = db.relationship('Event', backref='user', lazy=True)

    def to_dict(self) -> dict[str, str]:
        return {
            'user_id': str(self.user_id),
            'user_name': self.user_name,
            'user_email': self.user_email
        }

    @staticmethod
    def add_or_update_user(user_data: dict) -> tuple['User', bool]:
        existing_user = (User.query.filter_by(user_email=user_data.get('user_email'))
                         .first())

        if existing_user:
            for key, value in user_data.items():
                setattr(existing_user, key, value)
            db.session.commit()
            return existing_user, False
        else:
            new_user = User(**user_data)
            db.session.add(new_user)
            db.session.commit()
            return new_user, True

    @staticmethod
    def get_all() -> list['User']:
        return User.query.all()

    @staticmethod
    def find_user_by_email(email: str) -> int:
        user = User.query.filter_by(user_email=email).first()
        return user.user_id if user else None

    @staticmethod
    def get_user_by_id(user_id: int) -> Union['User', None]:
        user: Union[User, None] = db.session.get(User, user_id)
        return user if user else None
