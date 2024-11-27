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
    JWT_EXPIRY_HOURS: int = None

    BACKUP_INTERVAL_SECONDS: int = None
    BACKUP_MAX_NUMBER_OF_FILES: int = None

    # Rate Limiter related here
    RATE_LIMIT_DEFAULT: str = None
    RATE_LIMIT_POSTING: str = None

    # housekeeping
    CLEANUP_INTERVAL_SECONDS: int = None
    DAYS_TO_KEEP: int = None
    MIN_EVENT_COUNT: int = None

    # File related here
    ATTACHMENT_MAX_SIZE_MB: int = None
    MAX_ATTACHMENT_COUNT: int = None

    # dbconfig
    SQLALCHEMY_DATABASE_URI: str = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.PROJECT_ROOT = os.path.dirname(os.path.dirname(
                os.path.dirname(os.path.abspath(__file__))))
        return cls._instance

    def load(self, _env_file: str = None):
        _env_path: str = os.path.join(self.PROJECT_ROOT, "backend", _env_file)
        print(f"Loading configurations from path {_env_path}")
        if not load_dotenv(dotenv_path=_env_path, override=True):
            print("No .env file found. using default config (local testing).")

        self.TESTING = os.getenv('TESTING', "TRUE").lower() in ('true', '1', 't')

        self.FRONTEND_ADDR = os.getenv('FRONTEND_ADDR', 'http://localhost:3000')
        self.FRONTEND_BASEPATH = os.getenv('FRONTEND_BASEPATH', '/')
        self.BACKEND_ADDR = os.getenv('BACKEND_ADDR', 'http://localhost:5000')
        self.BACKEND_BASEPATH = os.getenv('BACKEND_BASEPATH', '/api/')

        self.ADMIN_USERNAME = os.getenv('ADMIN_USERNAME', 'admin')
        self.ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD', 'admin')

        self.JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your_jwt_secret')
        self.JWT_EXPIRY_HOURS = int(os.getenv('JWT_EXPIRY_HOURS', "1"))

        self.BACKUP_INTERVAL_SECONDS = int(os.getenv('BACKUP_INTERVAL_SECONDS',
                                                     "43200"))
        self.BACKUP_MAX_NUMBER_OF_FILES = int(os.getenv('BACKUP_MAX_NUMBER_OF_FILES',
                                                        "14"))

        self.RATE_LIMIT_DEFAULT = os.getenv('RATE_LIMITER_DEFAULT',
                                            "30 per minute")
        self.RATE_LIMIT_POSTING = os.getenv('RATE_LIMITER_POSTING',
                                            "5 per minute")

        self.CLEANUP_INTERVAL_SECONDS = int(os.getenv('CLEANUP_INTERVAL_SECONDS',
                                                      "43200"))
        self.DAYS_TO_KEEP = int(os.getenv('DAYS_TO_KEEP', "180"))
        self.MIN_EVENT_COUNT = int(os.getenv('MIN_EVENT_COUNT', "5"))

        self.ATTACHMENT_MAX_SIZE_MB = int(os.getenv('ATTACHMENT_MAX_SIZE_MB', "30"))
        self.MAX_ATTACHMENT_COUNT = int(os.getenv('MAX_ATTACHMENT_COUNT', "4"))

        self.SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI',
                                                 'sqlite:///:memory:')


config = Config()
