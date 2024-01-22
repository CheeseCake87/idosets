from flask import session, request
from flask_imp.security import api_login_check

from app_flask.models.workouts import Workouts
from app_flask.models.exercises import Exercises
from app_flask.models.sets import Sets, SetLogs
from app_flask.resources.utilities.datetime_delta import DatetimeDelta
from .. import bp


@bp.get("/workouts/<workout_id>/exercises")
@api_login_check(
    "logged_in", True, {"status": "unauthorized", "message": "unauthorized"}
)
def exercises_(workout_id):
    _exercises = Exercises.select_all(session.get("account_id", 0), workout_id)
    return {"status": "success", **_exercises}


@bp.get("/workouts/<workout_id>/exercises/<exercise_id>")
@api_login_check(
    "logged_in", True, {"status": "unauthorized", "message": "unauthorized"}
)
def exercise_(workout_id, exercise_id):
    _workout = Workouts.select_by_id(session.get("account_id", 0), workout_id)
    _exercise = Exercises.select_by_id(
        session.get("account_id", 0),
        workout_id,
        exercise_id,
    )
    _sets = Sets.select_all(
        session.get("account_id", 0), workout_id, exercise_id
    )
    return {"status": "success", **_workout, **_exercise, **_sets}


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
        "message": "Unable to add exercise.",
        "workout_id": 0,
    }


@bp.post("/workouts/<workout_id>/exercises/<exercise_id>/edit")
@api_login_check(
    "logged_in", True, {"status": "unauthorized", "message": "unauthorized"}
)
def exercises_edit_(workout_id, exercise_id):
    jsond = request.json
    _exercise = Exercises.update_(
        {"workout_id": workout_id, "exercise_id": exercise_id, **jsond}
    )

    return {
        "status": "success",
        "message": "Exercise edited successfully.",
        "exercise_id": _exercise.get("exercise_id"),
    }


@bp.delete("/workouts/<workout_id>/exercises/<exercise_id>/delete")
@api_login_check(
    "logged_in", True, {"status": "unauthorized", "message": "unauthorized"}
)
def exercises_delete_(workout_id, exercise_id):
    _ = workout_id
    Exercises.delete(exercise_id)
    Sets.delete_all_by_exercise_id(exercise_id)
    SetLogs.delete_all_by_exercise_id(exercise_id)
    return {
        "status": "success",
        "message": "Exercise edited successfully.",
        "exercise_id": exercise_id,
    }
