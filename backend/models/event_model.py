from backend.utils.database_Init import db


class Event(db.Model):
    __tablename__: str = 'events'

    event_id = db.Column(db.Integer, primary_key=True)
    dev_id = db.Column(db.Integer, db.ForeignKey('devices.dev_id'), nullable=False)
    # TODO: Add below db.ForeignKey('users.user_id')
    user_id = db.Column(db.Integer, nullable=False)
    move_time = db.Column(db.DateTime, nullable=False)
    loc_name = db.Column(db.String(200), nullable=False)

    def to_dict(self) -> dict[str, str]:
        return {
            'event_id': str(self.event_id),
            'dev_id': str(self.dev_id),
            'user_id': str(self.user_id),
            'move_time': self.move_time.isoformat() if self.move_time else None,
            'loc_name': self.loc_name
        }
