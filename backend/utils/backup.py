from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.schedulers.base import STATE_STOPPED
import os
import shutil
from datetime import datetime
from threading import Lock

from backend.utils.config import config


class Backup:
    _instance = None
    _lock = Lock()

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super(Backup, cls).__new__(cls)
                    cls._instance._initialized = False
        return cls._instance

    def __init__(self, interval_seconds: int = None, max_backups: int = None):
        if self._initialized:
            return

        self.interval_seconds = interval_seconds or config.BACKUP_INTERVAL_SECONDS
        self.max_backups = max_backups or config.BACKUP_MAX_NUMBER_OF_FILES
        self.db_path = os.path.join(config.PROJECT_ROOT, "instance", "database.db")
        self.backup_dir = os.path.join(config.PROJECT_ROOT, "instance", "backup")

        os.makedirs(self.backup_dir, exist_ok=True)
        self.scheduler = BackgroundScheduler()
        self._initialized = True
        print("Backup system initialized.")

    def backup_db(self):
        if not os.path.exists(self.db_path):
            print(f"Error: No database found at {self.db_path}. Backup aborted.")
            return

        timestamp = datetime.now().strftime("%Y-%m-%d")
        backup_db_path = os.path.join(self.backup_dir, f"database_{timestamp}.bak")
        shutil.copy2(self.db_path, backup_db_path)
        self.cleanup_old_backups()

    def cleanup_old_backups(self):
        backups = sorted(
            (f for f in os.listdir(self.backup_dir) if f.startswith("database_")),
            key=lambda f: os.path.getmtime(os.path.join(self.backup_dir, f))
        )
        for backup in backups[:-self.max_backups]:
            os.remove(os.path.join(self.backup_dir, backup))

    def start_scheduler(self):
        if not self.scheduler.running:
            self.scheduler.start()
            print("Backup scheduler started.")

    def stop_scheduler(self):
        if self.scheduler.state != STATE_STOPPED:
            self.scheduler.shutdown(wait=False)
            print("Backup scheduler stopped.")
