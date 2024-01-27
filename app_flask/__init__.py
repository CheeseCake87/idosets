from pathlib import Path

from flask import Flask, session, render_template

from app_flask.extensions import imp, db, head


def create_app():
    app = Flask(__name__, static_url_path="/")

    vite_assets = Path(app.root_path) / "resources" / "static" / "assets"
    if not vite_assets.exists():
        raise FileNotFoundError(f"{vite_assets} not found.")

    find_vite_js = vite_assets.glob("*.js")
    vite_js_file = next(find_vite_js)
    vite_js_file_url = "/assets/" + vite_js_file.name

    find_vite_css = vite_assets.glob("*.css")
    vite_css_file = next(find_vite_css)
    vite_css_file_url = "/assets/" + vite_css_file.name

    head.set_script_tag(
        src=vite_js_file_url,
        type="module",
    )
    head.set_link_tag(
        rel="stylesheet",
        href=vite_css_file_url,
    )

    imp.init_app(app)
    imp.import_app_resources(
        files_to_import=["error_handlers.py", "cli.py"],
        folders_to_import=[None],
    )
    imp.import_blueprint("api")
    imp.import_models("models")
    db.init_app(app)

    @app.route("/")
    def index():
        return render_template("index.html")

    @app.route("/failed")
    @app.route("/logout")
    @app.route("/login")
    @app.route("/auth", defaults={"wildcard": ""})
    @app.route("/auth/<path:wildcard>")
    @app.route("/workouts", defaults={"wildcard": ""})
    @app.route("/workouts/<path:wildcard>")
    @app.route("/workout", defaults={"wildcard": ""})
    @app.route("/workout/<path:wildcard>")
    @app.route("/session", defaults={"wildcard": ""})
    @app.route("/session/<path:wildcard>")
    @app.route("/account", defaults={"wildcard": ""})
    @app.route("/account/<path:wildcard>")
    @app.route("/error", defaults={"wildcard": ""})
    @app.route("/error/<path:wildcard>")
    def catch_all(wildcard):
        _ = wildcard
        return render_template("index.html")

    @app.context_processor
    def context_processor():
        return dict(head=head)

    @app.before_request
    def before_request():
        session.permanent = True
        imp.init_session()

    @app.after_request
    def after_request(response):
        if app.config["RUN_ENV"] == "development":
            response.headers.add(
                "Access-Control-Allow-Origin", app.config["VITE_URL"]
            )
            response.headers.add(
                "Access-Control-Allow-Headers", "Content-Type,Authorization"
            )
            response.headers.add(
                "Access-Control-Allow-Methods", "GET,PUT,POST,DELETE"
            )
            response.headers.add("Access-Control-Allow-Credentials", "true")
        return response

    return app
