from flask import request, session
from flask_imp.security import login_check

from .. import bp


@bp.route("/unauthorized", methods=["GET"])
def unauthorized():
    return {"status": "unauthorized", "message": "unauthorized"}


@bp.route("/", methods=["GET"])
def index():
    return {
        "API": "v1",
    }


@bp.post("/login")
def login():
    r = request.json
    if r["username"] == "admin" and r["password"] == "admin":
        session["logged_in"] = True
        return {"status": "authorized", "message": "You have been logged in."}
    return {"status": "error", "message": "Login attempt failed."}


@bp.get("/logout")
def logout():
    session["logged_in"] = False
    return {"status": "success", "message": "You have been logged out."}


@bp.route("/workouts", methods=["GET"])
@login_check("logged_in", True, fail_endpoint="api.unauthorized")
def workouts_():
    print(session)
    return {
        "status": "success",
        "Workouts": [
            {"workout_id": "1", "name": "Workout 1"},
            {"workout_id": "2", "name": "Workout 2"},
            {"workout_id": "3", "name": "Workout 3"},
        ]
    }
