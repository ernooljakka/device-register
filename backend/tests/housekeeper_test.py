import pytest
from datetime import datetime, timedelta

from backend.app import create_app
from backend.utils.config import config
from backend.utils.housekeeper import Housekeeper


@pytest.fixture
def housekeeper():
    app = create_app(".env-test")
    config.CLEANUP_INTERVAL_SECONDS = 10
    config.DAYS_TO_KEEP = 30
    config.MIN_EVENT_COUNT = 5

    housekeeper = Housekeeper(
        interval_seconds=config.CLEANUP_INTERVAL_SECONDS,
        days_to_keep=config.DAYS_TO_KEEP,
        min_event_count=config.MIN_EVENT_COUNT,
        app=app
    )
    housekeeper.start_scheduler()
    yield housekeeper
    housekeeper.stop_scheduler()


def test_housekeeper_initialization(housekeeper):
    assert housekeeper.interval_seconds == config.CLEANUP_INTERVAL_SECONDS
    assert housekeeper.days_to_keep == config.DAYS_TO_KEEP
    assert housekeeper.min_event_count == config.MIN_EVENT_COUNT
    assert housekeeper.scheduler.running, "Scheduler is not running as expected."


def test_cleanup_old_events(mocker, housekeeper):
    mock_cleanup_events = mocker.patch(
        'backend.models.event_model.Event.cleanup_events')
    mock_cleanup_users = mocker.patch(
        'backend.models.user_model.User.cleanup_users_without_events')

    housekeeper.cleanup_old_events()

    cutoff_date = datetime.now() - timedelta(days=config.DAYS_TO_KEEP)
    mock_cleanup_events.assert_called_once()
    called_args, _ = mock_cleanup_events.call_args
    assert abs((called_args[0] - cutoff_date).total_seconds()) < 1
    assert called_args[1] == config.MIN_EVENT_COUNT
    mock_cleanup_users.assert_called_once()


def test_scheduler_runs_cleanup(mocker, housekeeper):
    mock_cleanup_events = mocker.patch(
        'backend.models.event_model.Event.cleanup_events')
    mock_cleanup_users = mocker.patch(
        'backend.models.user_model.User.cleanup_users_without_events')

    housekeeper.cleanup_old_events()

    assert mock_cleanup_events.call_count == 1
    assert mock_cleanup_users.call_count == 1
