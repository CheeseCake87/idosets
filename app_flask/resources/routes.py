from datetime import datetime

from flask import current_app as app, render_template, session, redirect, url_for
from flask_imp.security import login_check

from app_flask.extensions import imp


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/set")
def set_():
    session["logged_in"] = True
    # session["last_request"] = datetime.now().timestamp()
    return redirect(url_for("test"))


@app.route("/failed")
def failed_():
    return "Failed"


@app.route("/test")
@login_check("logged_in", True, "failed_")
def test():
    if "last_request" in session:
        session["last_request"] = datetime.now().timestamp()
    return f"Test {[f'{key, val}' for key, val in session.items()]}"


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


@app.route("/account", defaults={"wildcard": ""})
@app.route("/account/<path:wildcard>")
def account(wildcard):
    _ = wildcard
    return render_template("index.html")
