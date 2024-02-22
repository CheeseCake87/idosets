from datetime import datetime

from flask import session, request
from flask_imp.security import api_login_check

from app_flask.models.exercises import Exercises
from app_flask.models.sets import Sets
from app_flask.models.set_logs import SetLogs
from app_flask.models.workout_sessions import WorkoutSessions
from app_flask.models.workouts import Workouts
from app_flask.resources.utilities.datetime_delta import DatetimeDelta
from .. import bp


@bp.get("/workouts")
@api_login_check(
    "logged_in", True, {"status": "unauthorized", "message": "unauthorized"}
)
def workouts_():
    _workouts = Workouts.select_all(session.get("account_id", 0))
    return {"status": "success", **_workouts}


@bp.get("/workouts/last")
@api_login_check(
    "logged_in", True, {"status": "unauthorized", "message": "unauthorized"}
)
def last_workout_():
    workout_session = WorkoutSessions.get_last_session(
        session.get("account_id", 0)
    )
    if workout_session:
        workout = Workouts.get_workout(workout_session.get("workout_id"))
        name = workout.get("name")
        finished: datetime = workout_session.get("finished")
        if workout:
            return {
                "status": "success",
                "last_workout_session": {
                    "name": name,
                    "finished": finished.strftime("%a, %d %b, %H:%M"),
                },
            }
    return {
        "status": "success",
        "last_workout_session": None,
    }


@bp.get("/workouts/<workout_id>")
@api_login_check(
    "logged_in", True, {"status": "unauthorized", "message": "unauthorized"}
)
def workout_(workout_id):
    _workout = Workouts.select_by_id(session.get("account_id", 0), workout_id)
    _exercises = Exercises.select_all(session.get("account_id", 0), workout_id)
    if _workout:
        return {"status": "success", **_workout, **_exercises}


@bp.post("/workouts/<workout_id>/logs")
# @api_login_check(
#     "logged_in", True, {"status": "unauthorized", "message": "unauthorized"}
# )
def workout_logs_(workout_id):
    jsond = request.json
    _workout = Workouts.get_workout(workout_id)
    _exercises = Exercises.json_exercise_set_logs_by_workout_id(
        workout_id, jsond.get("limit", 10)
    )
    if _exercises:
        return {"status": "success", **_workout, **_exercises}
    else:
        return {"status": "failed", "message": "No logs found."}


@bp.post("/workouts/add")
@api_login_check(
    "logged_in", True, {"status": "unauthorized", "message": "unauthorized"}
)
def workouts_add_():
    jsond = request.json

    name = jsond.get("name")
    account_id = session.get("account_id", 0)

    if name and len(name) > 0:
        _workout = Workouts.um_create(
            {
                "account_id": account_id,
                "name": name,
                "created": DatetimeDelta().datetime,
            },
            return_record=True,
        )
        return {
            "status": "success",
            "message": "Workout added successfully.",
            "workout_id": _workout.workout_id,
        }

    return {
        "status": "failed",
        "message": "Unable to add workout.",
        "workout_id": 0,
    }


@bp.post("/workouts/<workout_id>/edit")
@api_login_check(
    "logged_in", True, {"status": "unauthorized", "message": "unauthorized"}
)
def workouts_edit_(workout_id):
    jsond = request.json
    _workout = Workouts.update_({"workout_id": workout_id, **jsond})

    return {
        "status": "success",
        "message": "Workout edited successfully.",
        "workout_id": _workout.get("workout_id"),
    }


@bp.delete("/workouts/<workout_id>/delete")
@api_login_check(
    "logged_in", True, {"status": "unauthorized", "message": "unauthorized"}
)
def workouts_delete_(workout_id):
    Workouts.delete(workout_id)
    WorkoutSessions.delete_all_by_workout_id(workout_id)
    Exercises.delete_all_by_workout_id(workout_id)
    Sets.delete_all_by_workout_id(workout_id)
    SetLogs.delete_all_by_workout_id(workout_id)

    return {
        "status": "success",
        "message": "Workout edited successfully.",
        "workout_id": workout_id,
    }
