from flask import Flask, render_template, redirect, url_for, session

from app_flask.extensions import imp


def create_app():
    app = Flask(__name__, static_url_path="/")
    imp.init_app(app)
    imp.import_app_resources()
    imp.import_blueprint("api")

    @app.before_request
    def before_request():
        imp.init_session()

    @app.after_request
    def after_request(response):
        if app.debug:
            response.headers.add(
                "Access-Control-Allow-Origin", "http://localhost:3000"
            )
            response.headers.add(
                "Access-Control-Allow-Headers", "Content-Type,Authorization"
            )
            response.headers.add(
                "Access-Control-Allow-Methods", "GET,PUT,POST,DELETE"
            )
            response.headers.add(
                "Access-Control-Allow-Credentials", "true"
            )
        return response

    @app.route('/')
    def index():
        return render_template("index.html")

    @app.route('/login')
    def login():
        return render_template("index.html")

    @app.route('/logout')
    def logout():
        session.clear()
        imp.init_session()
        return redirect(url_for("index"))

    @app.route('/workouts', defaults={'wildcard': ''})
    @app.route('/workouts/<path:wildcard>')
    def workouts(wildcard):
        _ = wildcard
        return render_template("index.html")

    @app.route('/account', defaults={'wildcard': ''})
    @app.route('/account/<path:wildcard>')
    def account(wildcard):
        _ = wildcard
        return render_template("index.html")

    return app
