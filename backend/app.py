from flask import Flask
from backend.models.deviceModel import Device
from backend.utils.databaseInit import db

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    from backend.api.deviceApi import device_api
    app.register_blueprint(device_api, url_prefix='/api/devices')

    with app.app_context():
        db.create_all()

        # Adding a tests device, remove later
        existing_device = Device.query.filter_by(dev_serial="123456").first()

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
    def index():
        return "Hello from Flask with SQLAlchemy!"

    return app

# Running the app
if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)