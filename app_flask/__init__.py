from pathlib import Path

from flask import Flask, session, render_template

from app_flask.extensions import imp, db, head

solidjs_routes = (
    "/login",
    "/logout",
    "/auth/<account_id>/<auth_code>",
    "/account",
    "/account/delete/<account_id>/<auth_code>",
    "/workouts",
    "/workout/<workout_id>",
    "/workout/<workout_id>/exercise/<exercise_id>",
    "/workout/<workout_id>/session/<workout_session_id>"
)


def create_app():
    # Create and configure the app, auto import resources, and models
    app = Flask(__name__, static_url_path="/")
    imp.init_app(app)
    imp.import_app_resources(
        files_to_import=["error_handlers.py", "cli.py"],
        folders_to_import=[None],
    )
    imp.import_blueprint("api")
    imp.import_models("models")

    # Init the database
    db.init_app(app)

    # Search for the vite build assets folder
    vite_assets = Path(app.root_path) / "resources" / "static" / "assets"
    if not vite_assets.exists():
        raise FileNotFoundError(f"{vite_assets} not found.")

    find_vite_js = vite_assets.glob("*.js")
    vite_js_file = next(find_vite_js)
    vite_js_file_url = "/assets/" + vite_js_file.name

    find_vite_css = vite_assets.glob("*.css")
    vite_css_file = next(find_vite_css)
    vite_css_file_url = "/assets/" + vite_css_file.name

    # Set the head tag for the index.html template
    head.set_script_tag(
        src=vite_js_file_url,
        type="module",
    )
    head.set_link_tag(
        rel="stylesheet",
        href=vite_css_file_url,
    )

    # make the head tag available to all templates
    @app.context_processor
    def context_processor():
        return dict(head=head)

    # Add the solidjs routes to the app
    for route in solidjs_routes:
        app.add_url_rule(route, "solidjs")

    @app.endpoint("solidjs")
    def solidjs(*_, **__):
        return render_template("index.html")

    # Add the index route to the app
    @app.route("/")
    def index():
        return render_template("index.html")

    # Set the session
    @app.before_request
    def before_request():
        session.permanent = True
        imp.init_session()

    # Set the CORS headers if in the development environment
    if app.config["RUN_ENV"] == "development":
        @app.after_request
        def after_request(response):
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
