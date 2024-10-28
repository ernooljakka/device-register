from flasgger import Swagger


def setup_swagger(app):
    swagger: Swagger = Swagger(app, template_file='static/swagger.yaml')
    swagger.template['basePath'] = "/api/"
    return swagger
