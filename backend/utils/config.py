import os
from dotenv import load_dotenv


class Config:
    _instance = None

    # Internal here
    PROJECT_ROOT: str = None
    TESTING: bool = None

    # Deployment related here
    FRONTEND_ADDR: str = None
    FRONTEND_BASEPATH: str = None
    BACKEND_ADDR: str = None
    BACKEND_BASEPATH: str = None

    # Auth related here
    ADMIN_USERNAME: str = None
    ADMIN_PASSWORD: str = None
    JWT_SECRET_KEY: str = None

    # dbconfig
    SQLALCHEMY_DATABASE_URI: str = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.load()
        return cls._instance

    def load(self, _env_file: str = None):
        _project_root = os.path.dirname(os.path.dirname(
            os.path.dirname(os.path.abspath(__file__))))
        if _env_file is None:
            _env_path = os.path.join(_project_root, '.env')
            print(f"Loading configurations from default path {_env_path}")
        else:
            _env_path = os.path.join(_project_root, _env_file)
            print(f"Loading configurations from path {_env_path}")
        if not load_dotenv(_env_path):
            print("No .env file found. using default config (local testing).")

        self.PROJECT_ROOT = os.path.dirname(_env_path)
        self.TESTING = os.getenv('TESTING', "False").lower() in ('true', '1', 't')

        self.FRONTEND_ADDR = os.getenv('FRONTEND_URL', 'http://localhost:3000')
        self.FRONTEND_BASEPATH = os.getenv('FRONTEND_BASEPATH', '/')
        self.BACKEND_ADDR = os.getenv('BACKEND_URL', 'http://localhost:5000')
        self.BACKEND_BASEPATH = os.getenv('BACKEND_BASEPATH', '/api/')

        self.ADMIN_USERNAME = os.getenv('ADMIN_USERNAME', 'admin')
        self.ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD', 'admin')
        self.JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your_jwt_secret')

        self.SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI',
                                                 'sqlite:///:memory:')


config = Config()
