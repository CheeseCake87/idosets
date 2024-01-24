from flask import (
    current_app as app,
    render_template,
    session,
    redirect,
    url_for,
)

from app_flask.extensions import imp


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/failed")
def failed_():
    return "Failed"


@app.route("/login")
def login():
    return render_template("index.html")


@app.route("/logout")
def logout():
    session.clear()
    imp.init_session()
    return redirect(url_for("index"))


@app.route("/auth", defaults={"wildcard": ""})
@app.route("/auth/<path:wildcard>")
def auth_(wildcard):
    _ = wildcard
    return render_template("index.html")


@app.route("/workouts", defaults={"wildcard": ""})
@app.route("/workouts/<path:wildcard>")
def workouts(wildcard):
    _ = wildcard
    return render_template("index.html")


@app.route("/workout", defaults={"wildcard": ""})
@app.route("/workout/<path:wildcard>")
def workout(wildcard):
    _ = wildcard
    return render_template("index.html")


@app.route("/session", defaults={"wildcard": ""})
@app.route("/session/<path:wildcard>")
def session(wildcard):
    _ = wildcard
    return render_template("index.html")


@app.route("/account", defaults={"wildcard": ""})
@app.route("/account/<path:wildcard>")
def account(wildcard):
    _ = wildcard
    return render_template("index.html")


@app.route("/error", defaults={"wildcard": ""})
@app.route("/error/<path:wildcard>")
def error_(wildcard):
    _ = wildcard
    return render_template("index.html")
