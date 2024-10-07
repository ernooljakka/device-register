from flask import Flask
from backend.setup.database_Init import db
from flask_cors import CORS
from backend.setup.swagger_setup import setup_swagger
from sqlalchemy import event
from sqlalchemy.engine import Engine


@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record) -> None:
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()


def create_app(testing: bool = True) -> Flask:
    deployment_path = '/'
    app = Flask(__name__)
    CORS(app)
    if testing:
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        deployment_path = '/api/'
    else:
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
    setup_swagger(app)

    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    from backend.api.device_api import device_api
    app.register_blueprint(device_api, url_prefix=f'{deployment_path}/devices')

    from backend.api.user_api import user_api
    app.register_blueprint(user_api, url_prefix=f'{deployment_path}/users')

    from backend.api.event_api import event_api
    app.register_blueprint(event_api, url_prefix=f'{deployment_path}/events')

    with app.app_context():
        db.create_all()

    @app.route('/flask')
    def index() -> str:
        return "Hello from Flask with SQLAlchemy!"

    return app


# Running the app
if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
