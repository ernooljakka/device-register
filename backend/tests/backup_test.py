import os
import time
from pathlib import Path

import pytest

from backend.app import create_app
from backend.utils.backup import Backup
from backend.utils.config import config


@pytest.fixture
def backup_dir(tmp_path):
    create_app(env_config_file=".env.test")
    Backup(interval_seconds=1, max_backups=2)
    backup_dir = Path(os.path.join(config.PROJECT_ROOT, "instance", "backup"))
    backup_dir.mkdir(parents=True, exist_ok=True)
    yield backup_dir

    for backup_file in backup_dir.glob("database_*.bak"):
        backup_file.unlink()
    os.rmdir(backup_dir)


def test_backup_and_cleanup(backup_dir):
    backup_dir = Path(backup_dir)

    max_wait_time = 10
    check_interval = 1
    total_wait_time = 0

    while total_wait_time < max_wait_time:
        backups = sorted(backup_dir.glob("database_*.bak"))
        time.sleep(check_interval)
        total_wait_time += check_interval
        if len(backups) == 1:
            break

    assert len(backups) == 1

    for backup_file in backups:
        assert backup_file.exists()
