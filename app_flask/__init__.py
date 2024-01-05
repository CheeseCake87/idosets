from flask import Flask
from app_flask.extensions import imp


def create_app():
    app = Flask(__name__, static_url_path="/")
    imp.init_app(app)
    imp.import_app_resources()
    imp.import_blueprint("www")

    return app
