from flask import session, request
from flask_imp.security import api_login_check

from app_flask.models.exercises import Exercises
from app_flask.models.workouts import Workouts
from app_flask.resources.utilities.datetime_delta import DatetimeDelta
from .. import bp


@bp.get("/workouts/<workout_id>/exercises")
@api_login_check(
    "logged_in", True, {"status": "unauthorized", "message": "unauthorized"}
)
def exercises_(workout_id):
    account_id = session.get("account_id", 0)
    _exercises = Exercises.select_all(account_id, workout_id)
    return {"status": "success", **_exercises}


@bp.get("/workouts/<workout_id>/exercises/<exercise_id>")
@api_login_check(
    "logged_in", True, {"status": "unauthorized", "message": "unauthorized"}
)
def exercise_(workout_id, exercise_id):
    _exercise = Exercises.get_by_key(
        exercise_id, {"workout_id": workout_id}, as_json=True
    )
    if _exercise:
        return {"status": "success", **_exercise}


@bp.post("/workouts/<workout_id>/exercises/add")
@api_login_check(
    "logged_in", True, {"status": "unauthorized", "message": "unauthorized"}
)
def exercises_add_(workout_id):
    jsond = request.json

    account_id = session.get("account_id", 0)

    name = jsond.get("name")
    info_url = jsond.get("info_url")
    order = jsond.get("order")

    if name and len(name) > 0:
        _exercise, _exercise_id = Exercises.insert(
            {
                "account_id": account_id,
                "workout_id": workout_id,
                "order": order,
                "name": name,
                "info_url": info_url,
                "created": DatetimeDelta().datetime,
            }
        )
        return {
            "status": "success",
            "message": "Exercise added successfully.",
            "exercise_id": _exercise_id,
        }

    return {
        "status": "failed",
        "message": "Unable to add workout.",
        "workout_id": 0,
    }


@bp.post("/workouts/<workout_id>/exercises/<exercise_id>/edit")
@api_login_check(
    "logged_in", True, {"status": "unauthorized", "message": "unauthorized"}
)
def exercises_edit_(workout_id, exercise_id):
    jsond = request.json
    _workout = Workouts.update_(
        {"workout_id": workout_id, "exercise_id": exercise_id, **jsond}
    )

    return {
        "status": "success",
        "message": "Workout edited successfully.",
        "workout_id": _workout.get("workout_id"),
    }
