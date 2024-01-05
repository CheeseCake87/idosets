from flask import Flask, render_template

from app_flask.extensions import imp


def create_app():
    app = Flask(__name__, static_url_path="/")
    imp.init_app(app)
    imp.import_app_resources()

    @app.route("/")
    def index():
        return render_template("index.html")

    return app
