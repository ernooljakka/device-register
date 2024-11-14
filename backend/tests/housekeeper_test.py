import pytest
from datetime import datetime, timedelta
from backend.app import create_app
from backend.models.class_model import Class
from backend.setup.database_Init import db
from backend.models.device_model import Device
from backend.models.event_model import Event
from backend.models.user_model import User
from backend.utils.housekeeper import Housekeeper
from backend.utils.config import config


@pytest.fixture
def app():
    app = create_app(env_config_file=".env.development")

    with app.app_context():
        db.create_all()

        test_class = Class(class_name="Class A")
        db.session.add(test_class)
        db.session.commit()

        device = Device(
            dev_name="Test Device",
            dev_manufacturer="Manfact",
            dev_model="Model",
            class_id=test_class.class_id,
            dev_comments="Test comment"
        )
        db.session.add(device)
        db.session.commit()

        user_with_events = User(user_name="UserWithEvents",
                                user_email="user_with_events@example.com")
        user_without_events = User(user_name="UserWithoutEvents",
                                   user_email="user_without_events@example.com")
        db.session.add_all([user_with_events, user_without_events])
        db.session.commit()

        cutoff_date = datetime.now() - timedelta(days=config.DAYS_TO_KEEP + 1)
        recent_date = datetime.now() - timedelta(days=5)

        for i in range(10):
            old_event = Event(
                dev_id=device.dev_id,
                user_id=user_with_events.user_id,
                move_time=cutoff_date + timedelta(minutes=i),
                loc_name="Location",
                company="Company",
                comment="Old Event"
            )
            db.session.add(old_event)

        for i in range(2):
            recent_event = Event(
                dev_id=device.dev_id,
                user_id=user_with_events.user_id,
                move_time=recent_date + timedelta(minutes=i),
                loc_name="Location",
                company="Company",
                comment="Recent Event"
            )
            db.session.add(recent_event)

        db.session.commit()
    yield app

    with app.app_context():
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()


def test_housekeeper_cleanup(app):
    housekeeper = Housekeeper(interval_seconds=10)

    with (app.app_context()):
        housekeeper.cleanup_old_events()
        housekeeper.cleanup_users_without_events()

        events_remaining = Event.query.filter_by(user_id=1).all()
        assert len(events_remaining) == config.MIN_EVENT_COUNT

        user = User.query.filter_by(
            user_email="user_without_events@example.com").first()
        assert user is None, "User without events was not deleted"
