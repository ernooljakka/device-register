import sys
sys.path.insert(0, '/opt/device-register')

from backend.app import create_app
from backend.utils.backup import Backup
from backend.utils.housekeeper import Housekeeper
from backend.utils.config import config

config.load(".env.production")

app = create_app(".env.production")
application = app

with app.app_context():
    backup = Backup(
        interval_seconds=config.BACKUP_INTERVAL_SECONDS,
        max_backups=config.BACKUP_MAX_NUMBER_OF_FILES
    )
    backup.start_scheduler()

    housekeeper = Housekeeper(
        app=app,
        interval_seconds=config.CLEANUP_INTERVAL_SECONDS,
        days_to_keep=config.DAYS_TO_KEEP,
        min_event_count=config.MIN_EVENT_COUNT
    )
    housekeeper.start_scheduler()

if __name__ == "__main__":
    with app.app_context():
        backup.start_scheduler()
        housekeeper.start_scheduler()
