from flask import current_app as app, render_template, session, redirect, url_for

from app_flask.extensions import imp


@app.route("/")
def index():
    return render_template("index.html")


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
