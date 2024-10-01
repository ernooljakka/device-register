from backend.utils.database_Init import db


class User(db.Model):
    __tablename__ = 'users'

    user_id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(100), nullable=False)
    user_email = db.Column(db.String(50), nullable=False, unique=True)

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
    def get_user_by_id(user_id: int) -> 'User':
        user: User | None = db.session.get(User, user_id)
        return user if user else None
