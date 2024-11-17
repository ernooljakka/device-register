import pytest
from datetime import datetime, timedelta
from sqlalchemy.exc import SQLAlchemyError
from backend.models.event_model import Event
from backend.models.user_model import User


@pytest.fixture
def mock_db_session(mocker):
    return mocker.patch('backend.setup.database_Init.db.session')


def test_event_to_dict():
    event = Event(
        event_id=1,
        dev_id=2,
        user_id=3,
        move_time=datetime(2024, 1, 1, 12, 0, 0),
        loc_name="Test Location",
        company="Test Company",
        comment="Test Comment"
    )
    event_dict = event.to_dict()
    assert event_dict['event_id'] == '1'
    assert event_dict['dev_id'] == '2'
    assert event_dict['user_id'] == '3'
    assert event_dict['move_time'] == '2024-01-01T12:00:00'
    assert event_dict['loc_name'] == "Test Location"
    assert event_dict['company'] == "Test Company"
    assert event_dict['comment'] == "Test Comment"


def test_user_to_dict():
    user = User(
        user_id=1,
        user_name="Test User",
        user_email="test@example.com"
    )
    user_dict = user.to_dict()
    assert user_dict['user_id'] == '1'
    assert user_dict['user_name'] == "Test User"
    assert user_dict['user_email'] == "test@example.com"


def test_create_event_success(mock_db_session):
    mock_db_session.commit.return_value = None
    event_list = [
        Event(dev_id=1, user_id=1, move_time=datetime.now(),
              loc_name="loc", company="comp", comment="comment")
    ]
    result, error = Event.create_event(event_list)
    assert result is True
    assert error == ""
    mock_db_session.commit.assert_called_once()


def test_create_event_failure(mock_db_session):
    mock_db_session.commit.side_effect = SQLAlchemyError("Mock exception")
    result, error = Event.create_event([])
    assert result is False
    assert "Mock exception" in error
    mock_db_session.rollback.assert_called_once()


def test_remove_event_success(mock_db_session, mocker):
    mock_event = mocker.Mock()
    mocker.patch('backend.models.event_model.Event.get_event_by_id',
                 return_value=mock_event)

    result = Event.remove_event(1)
    assert result is True
    mock_db_session.delete.assert_called_once_with(mock_event)
    mock_db_session.commit.assert_called_once()


def test_remove_event_not_found(mock_db_session, mocker):
    mocker.patch('backend.models.event_model.Event.get_event_by_id', return_value=None)

    result = Event.remove_event(999)
    assert result is False
    mock_db_session.commit.assert_not_called()


def test_cleanup_users_without_events(mock_db_session, mocker):
    mock_query = mocker.Mock()
    mock_db_session.query.return_value = mock_query
    mock_query.outerjoin.return_value = mock_query
    mock_query.filter.return_value = mock_query
    mock_query.all.return_value = [mocker.Mock(), mocker.Mock()]

    User.cleanup_users_without_events()

    assert mock_db_session.delete.call_count == 2
    mock_db_session.commit.assert_called_once()


def test_cleanup_events(mock_db_session, mocker):
    mock_query = mocker.Mock()
    mock_db_session.query.return_value = mock_query
    mock_query.filter.return_value = mock_query
    mock_query.group_by.return_value = mock_query
    mock_query.having.return_value = mock_query
    mock_query.all.return_value = [(1,), (2,)]

    mock_query.filter_by.return_value.count.side_effect = [10, 3]

    mock_event = mocker.Mock()
    mock_query.filter.return_value.order_by.return_value.limit\
        .return_value = [mock_event]

    cutoff_date = datetime.now() - timedelta(days=30)
    Event.cleanup_events(cutoff_date, min_event_count=5)

    mock_db_session.delete.assert_called_once_with(mock_event)
    mock_db_session.commit.assert_called_once()
