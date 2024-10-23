from flasgger import Swagger

from backend.utils.config import config


def setup_swagger(app):
    swagger: Swagger = Swagger(app, template_file='static/swagger.yaml')
    swagger.template['basePath'] = config.BACKEND_BASEPATH
    return swagger
