import os
import time
from pathlib import Path

import pytest
from backend.app import create_app
from backend.utils.config import config


@pytest.fixture
def backup_dir(tmp_path):
    create_app(env_config_file=".env.test")
    backup_dir = Path(os.path.join(config.PROJECT_ROOT, "instance", "backup"))
    backup_dir.mkdir(parents=True, exist_ok=True)
    yield backup_dir

    for backup_file in backup_dir.glob("database_*.bak"):
        backup_file.unlink()
    os.rmdir(backup_dir)


def test_backup_and_cleanup(backup_dir):
    backup_dir = Path(backup_dir)
    time.sleep(5)
    backups = sorted(backup_dir.glob("database_*.bak"))
    assert len(backups) == 2
    for backup_file in backups:
        assert backup_file.exists()
