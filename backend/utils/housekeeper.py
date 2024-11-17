from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.schedulers.base import STATE_STOPPED
from datetime import datetime, timedelta
from threading import Lock

from flask import Flask

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

    def __init__(self, app: Flask, interval_seconds: int = None,
                 days_to_keep: int = None,
                 min_event_count: int = None):
        if self._initialized:
            return

        self.app = app
        self.interval_seconds = interval_seconds or config.CLEANUP_INTERVAL_SECONDS
        self.days_to_keep = days_to_keep or config.DAYS_TO_KEEP
        self.min_event_count = min_event_count or config.MIN_EVENT_COUNT
        self.scheduler = BackgroundScheduler()
        self._initialized = True
        print("Housekeeper system initialized.")

    def start_scheduler(self):
        if not self.scheduler.running:
            self.scheduler.add_job(self._wrapped_cleanup_old_events, 'interval',
                                   seconds=self.interval_seconds)
            self.scheduler.start()
            print("Housekeeper BackgroundScheduler started.")

    def _wrapped_cleanup_old_events(self):
        print("Attempting to clean up old events...")
        with self.app.app_context():
            self.cleanup_old_events()
            print("Old events cleanup completed.")

    def cleanup_old_events(self):
        cutoff_date = datetime.now() - timedelta(days=self.days_to_keep)
        print(f"Cleaning events before {cutoff_date}")
        Event.cleanup_events(cutoff_date, self.min_event_count)
        User.cleanup_users_without_events()

    def stop_scheduler(self):
        if self.scheduler and self.scheduler.state != STATE_STOPPED:
            self.scheduler.shutdown(wait=False)
            print("Housekeeper scheduler stopped.")
