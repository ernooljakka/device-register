import sys
sys.path.insert(0, '/opt/device-register')
from backend.app import create_app

app = create_app(".env.production")
application = app
