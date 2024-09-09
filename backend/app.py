from flask import Flask
from backend.models.device_model import Device
from backend.utils.database_Init import db
from typing import Optional


def create_app() -> Flask:
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    from backend.api.device_api import device_api
    app.register_blueprint(device_api, url_prefix='/api/devices')

    with (((app.app_context()))):
        db.create_all()

        # Adding a test device, remove later
        existing_device: Optional[Device] = (
            Device.query.filter_by(dev_serial="123456").first()
        )

        if not existing_device:
            test_device = Device(
                dev_name="Test",
                dev_type="Type",
                dev_serial="123456",
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
