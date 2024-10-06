import sys
from backend.app import create_app

sys.path.insert(0, '/opt/device-register')

app = create_app()
application = app
