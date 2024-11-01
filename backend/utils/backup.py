from apscheduler.schedulers.background import BackgroundScheduler
import os
import shutil
from datetime import datetime

from backend.utils.config import config


class Backup:
    def __init__(self, interval_seconds: int = None):
        if not interval_seconds:
            interval_seconds = config.BACKUP_INTERVAL_SECONDS
        self.db_path = os.path.join(config.PROJECT_ROOT, "instance", "database.db")
        self.backup_dir = os.path.join(config.PROJECT_ROOT, "instance", "backup")
        os.makedirs(self.backup_dir, exist_ok=True)
        self.scheduler = BackgroundScheduler()
        self.scheduler.add_job(self.backup_db, 'interval', seconds=interval_seconds)
        self.scheduler.start()

    def backup_db(self):
        if not os.path.exists(self.db_path):
            print(f"backup error: no db found at {self.db_path}")
            return

        timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        backup_db_path = os.path.join(self.backup_dir, f"database_{timestamp}.bak")
        shutil.copy2(self.db_path, backup_db_path)
        self.cleanup_old_backups()

    def cleanup_old_backups(self):
        backups = sorted(
            (f for f in os.listdir(self.backup_dir) if f.startswith("database_")),
            key=lambda f: os.path.getmtime(os.path.join(self.backup_dir, f))
        )
        for backup in backups[:-config.BACKUP_MAX_NUMBER_OF_FILES]:
            os.remove(os.path.join(self.backup_dir, backup))
