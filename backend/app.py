from flask import Flask
from backend.models.device_model import Device
from backend.utils.database_Init import db
from flask_cors import CORS


def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    from backend.api.device_api import device_api
    app.register_blueprint(device_api, url_prefix='/api/devices')

    from backend.api.user_api import user_api
    app.register_blueprint(user_api, url_prefix='/api/users')

    from backend.api.event_api import event_api
    app.register_blueprint(event_api, url_prefix='/api/events')

    with (((app.app_context()))):
        db.create_all()

        # Adding a test device, remove later
        existing_device: Device | None = (
            Device.query.filter_by(dev_name="Device", dev_model="Model S").first()
        )

        if not existing_device:
            test_device = Device(
                dev_name="Device",
                dev_manufacturer="Manfact A",
                dev_model="Model S",
                dev_class="class A",
                dev_comments="Location: Herwood xyz"
            )
            db.session.add(test_device)
            db.session.commit()
            print("Test device added successfully.")
        else:
            print("Test device already exists.")

    @app.route('/')
    def index() -> str:
        return "Hello from Flask with SQLAlchemy!"

    return app


# Running the app
if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
