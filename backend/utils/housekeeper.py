from threading import Lock

from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
from backend.setup.database_Init import db
from backend.utils.config import config
from backend.models.event_model import Event
from backend.models.user_model import User


class Housekeeper:
    _instance = None
    _lock = Lock()

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super(Housekeeper, cls).__new__(cls)
                    cls._instance._initialized = False
        return cls._instance

    def __init__(self,
                 interval_seconds: int = None,
                 days_to_keep: int = None,
                 min_event_count: int = None):
        if not interval_seconds:
            interval_seconds = config.CLEANUP_INTERVAL_SECONDS
        if not days_to_keep:
            days_to_keep = config.DAYS_TO_KEEP
        if not min_event_count:
            min_event_count = config.MIN_EVENT_COUNT

        self.interval_seconds = interval_seconds
        self.days_to_keep = days_to_keep
        self.min_event_count = min_event_count

        self.scheduler = BackgroundScheduler()
        self.scheduler.add_job(self.cleanup_old_events, 'interval',
                               seconds=interval_seconds)
        self.scheduler.start()

    def cleanup_old_events(self):
        cutoff_date = datetime.now() - timedelta(days=self.days_to_keep)
        devices_with_old_events = (
            db.session.query(Event.dev_id)
            .filter(Event.move_time < cutoff_date)
            .group_by(Event.dev_id)
            .having(db.func.count(Event.event_id) > self.min_event_count)
            .all()
        )

        for dev_id, in devices_with_old_events:
            total_event_count = db.session.query(Event).filter_by(dev_id=dev_id).count()

            if total_event_count <= self.min_event_count:
                continue

            events_to_delete = (
                db.session.query(Event)
                .filter(Event.dev_id == dev_id, Event.move_time < cutoff_date)
                .order_by(Event.move_time.asc())
                .limit(total_event_count - self.min_event_count)
            )
            for event in events_to_delete:
                db.session.delete(event)

        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            print(f"Failed to clean up old events: {e}")
        self.cleanup_users_without_events()

    def cleanup_users_without_events(self):
        users_without_events = (
            db.session.query(User)
            .outerjoin(Event, User.user_id == Event.user_id)
            .filter(Event.user_id.is_(None))
            .all())

        for user in users_without_events:
            db.session.delete(user)

        try:
            db.session.commit()
            print("Users without events cleanup completed successfully.")
        except Exception as e:
            db.session.rollback()
            print(f"Failed to clean up users without events: {e}")
