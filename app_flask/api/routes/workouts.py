from flask import session, request
from flask_imp.security import api_login_check

from app_flask.models.workouts import Workouts
from app_flask.resources.utilities.datetime_delta import DatetimeDelta
from .. import bp


@bp.get("/workouts")
@api_login_check(
    "logged_in", True, {"status": "unauthorized", "message": "unauthorized"}
)
def workouts_():
    _workouts = Workouts.select_all(session.get("account_id", 0))
    return {
        "status": "success",
        **_workouts
    }


@bp.post("/workouts/add")
@api_login_check(
    "logged_in", True, {"status": "unauthorized", "message": "unauthorized"}
)
def workouts_add_():
    jsond = request.json

    name = jsond.get("name")
    account_id = session.get("account_id", 0)

    if name and len(name) > 0 and account_id:
        _workouts = Workouts.insert(
            {
                "account_id": session.get("account_id", 0),
                "name": name,
                "created": DatetimeDelta().datetime
            }
        )
        return {
            "status": "success",
            "message": "Workout added successfully.",
        }

    return {
        "status": "failed",
        "message": "Unable to add workout.",
    }


@bp.get("/workouts/<workout_id>")
@api_login_check(
    "logged_in", True, {"status": "unauthorized", "message": "unauthorized"}
)
def workout_(workout_id):
    _workout = Workouts.select_by_id(workout_id)
    if _workout:
        return {
            "status": "success",
            **_workout
        }
