from flask import Flask, session, render_template, redirect

from app.config import flask_config, imp_config, solidjs_routes
from app.extensions import imp, db, vt
from app.models.accounts import Accounts


def create_app():
    # Create and configure the app, auto import resources, and models
    app = Flask(__name__, static_url_path="/")
    flask_config.init_app(app)

    imp.init_app(app, imp_config)
    imp.import_app_resources()
    imp.import_blueprint("api")
    imp.import_models("models")

    vt.init_app(
        app,
        cors_allowed_hosts=[
            "http://127.0.0.1:5002",
        ]
        if app.debug
        else None,
    )

    db.init_app(app)

    # Add the solidjs routes to the app
    for route in solidjs_routes:
        app.add_url_rule(route[0], route[1])

    @app.endpoint("solidjs")
    def solidjs(*_, **__):
        return render_template("index.html")

    @app.endpoint("auth")
    def auth(account_id, auth_code):
        account_ = Accounts.process_auth_code(account_id, auth_code)

        if account_:
            settings = account_.settings

            session["logged_in"] = True
            session["account_id"] = account_.account_id
            session["theme"] = settings.get("theme", "dark")
            session["units"] = settings.get("units", "kgs")

            return redirect("/workouts")

        return render_template("index.html")

    # Add the index route to the app
    @app.route("/")
    def index():
        return render_template("index.html")

    # Set the session
    @app.before_request
    def before_request():
        session.permanent = True

    return app
