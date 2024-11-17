import os
from datetime import datetime
from unittest.mock import patch
import pytest
from apscheduler.schedulers.background import BackgroundScheduler

from backend.utils.backup import Backup


@pytest.fixture
def backup_instance(mocker):
    mocker.patch('backend.utils.backup.config.PROJECT_ROOT', '/mock_project_root')
    backup = Backup(interval_seconds=3600, max_backups=5)
    backup.start_scheduler()
    yield backup
    backup.stop_scheduler()


def test_backup_initialization(mocker):
    mocker.patch('backend.utils.backup.config.PROJECT_ROOT', '/mock_project_root')
    mock_makedirs = mocker.patch('os.makedirs')

    backup = Backup(interval_seconds=3600, max_backups=5)

    assert backup.interval_seconds == 3600
    assert backup.max_backups == 5
    assert isinstance(backup.scheduler, BackgroundScheduler), \
        "Scheduler is not properly initialized"
    mock_makedirs.assert_called_once_with('/mock_project_root/instance/backup',
                                          exist_ok=True)

    backup.start_scheduler()
    assert backup.scheduler.running, "Scheduler did not start as expected"


def test_backup_db_creates_backup(mocker, backup_instance):
    mock_db_path = '/mock_project_root/instance/database.db'
    mock_backup_dir = '/mock_project_root/instance/backup'

    mocker.patch('os.path.exists', return_value=True)
    mock_copy2 = mocker.patch('shutil.copy2')
    mock_listdir = mocker.patch('os.listdir', return_value=[])

    backup_instance.backup_db()

    timestamp = datetime.now().strftime("%Y-%m-%d")
    expected_backup = os.path.join(mock_backup_dir, f"database_{timestamp}.bak")
    mock_copy2.assert_called_once_with(mock_db_path, expected_backup)
    mock_listdir.assert_called_once_with(mock_backup_dir)


def test_backup_db_handles_missing_db(mocker, backup_instance):
    mocker.patch('os.path.exists', return_value=False)

    with patch('builtins.print') as mock_print:
        backup_instance.backup_db()
        mock_print.assert_called_with(f"Error: No database found at "
                                      f"{backup_instance.db_path}. Backup aborted.")


def test_cleanup_old_backups(mocker, backup_instance):
    mock_backup_dir = '/mock_project_root/instance/backup'
    mocker.patch('os.listdir', return_value=['database_old.bak', 'database_new.bak'])
    mocker.patch('os.path.getmtime', side_effect=[1, 2])
    mock_remove = mocker.patch('os.remove')

    backup_instance.max_backups = 1

    backup_instance.cleanup_old_backups()
    mock_remove.assert_called_once_with(os.path.join(mock_backup_dir,
                                                     'database_old.bak'))
