from flask import session, request
from flask_imp.security import api_login_check

from app_flask.models.sets import SetLogs
from app_flask.models.workouts import Workouts, WorkoutSessions
from .. import bp


@bp.get("/workout/<workout_id>/sessions/<workout_session_id>")
@api_login_check(
    "logged_in", True, {"status": "unauthorized", "message": "unauthorized"}
)
def get_session_(workout_id, workout_session_id):
    account_id = session.get("account_id", 0)

    workout_session = Workouts.get_session(
        account_id=account_id,
        workout_id=workout_id,
        workout_session_id=workout_session_id,
        weight_unit=session.get("units", "kgs")
    )

    if workout_session.get("error"):
        return {
            "status": "error",
            "message": workout_session.get("error"),
        }

    return {
        "status": "success",
        "message": "-",
        **workout_session,
    }


@bp.delete("/workout/<workout_id>/sessions/<workout_session_id>/delete")
@api_login_check(
    "logged_in", True, {"status": "unauthorized", "message": "unauthorized"}
)
def delete_session_(workout_session_id):
    _ = WorkoutSessions

    return {
        "status": "success",
        "message": "Workout deleted successfully.",
        "workout_session_id": workout_session_id,
    }


@bp.get("/workout/<workout_id>/sessions")
@api_login_check(
    "logged_in", True, {"status": "unauthorized", "message": "unauthorized"}
)
def sessions_():
    return {
        "status": "success",
        "message": "-",
        **WorkoutSessions.sessions(session.get("account_id", 0)),
    }


@bp.get("/sessions/active")
@api_login_check(
    "logged_in", True, {"status": "unauthorized", "message": "unauthorized"}
)
def sessions_active_():
    return {
        "status": "success",
        "message": "-",
        **WorkoutSessions.active_sessions(session.get("account_id", 0)),
    }


@bp.get("/workout/<workout_id>/sessions/start")
@api_login_check(
    "logged_in", True, {"status": "unauthorized", "message": "unauthorized"}
)
def sessions_start_(workout_id):
    session_ = WorkoutSessions.start_session(
        account_id=session.get("account_id", 0), workout_id=workout_id
    )
    return {
        "status": "success",
        "message": "Workout session started.",
        **session_,
    }


@bp.get("/workout/<workout_id>/sessions/<workout_session_id>/stop")
@api_login_check(
    "logged_in", True, {"status": "unauthorized", "message": "unauthorized"}
)
def sessions_stop_(workout_id, workout_session_id):
    _ = workout_id

    session_ = WorkoutSessions.stop_session(
        account_id=session.get("account_id", 0),
        workout_session_id=workout_session_id,
    )

    return {
        "status": "success",
        "message": "Workout edited successfully.",
        **session_,
    }


@bp.post("/workouts/<workout_id>/sessions/<workout_session_id>/log-set")
@api_login_check(
    "logged_in", True, {"status": "unauthorized", "message": "unauthorized"}
)
def sets_log_set_(workout_id, workout_session_id):
    jsond = request.json

    account_id = session.get("account_id", 0)
    weight_units = session.get("units", "kgs")

    workout_id = workout_id
    workout_session_id = workout_session_id

    exercise_id = jsond.get("exercise_id")
    set_id = jsond.get("set_id")

    weight = jsond.get("weight")
    duration = jsond.get("duration")
    reps = jsond.get("reps")

    _set_log_id = SetLogs.add_log(
        account_id=account_id,
        workout_id=workout_id,
        workout_session_id=workout_session_id,
        exercise_id=exercise_id,
        set_id=set_id,
        weight=weight,
        duration=duration,
        reps=reps,
        weight_unit=weight_units,
    )
    return {
        "status": "success",
        "message": "Set log added successfully.",
        "set_log": {
            "set_log_id": _set_log_id,
            "account_id": account_id,
            "workout_id": workout_id,
            "workout_session_id": workout_session_id,
            "exercise_id": exercise_id,
            "set_id": set_id,
            "weight": weight,
            "duration": duration,
            "reps": reps,
        }
    }


@bp.delete(
    "/workouts/<workout_id>/sessions/<workout_session_id>/log-set/<set_log_id>/delete"
)
@api_login_check(
    "logged_in", True, {"status": "unauthorized", "message": "unauthorized"}
)
def delete_set_log_(workout_id, workout_session_id, set_log_id):
    _ = workout_id
    _ = workout_session_id

    SetLogs.delete_by_set_log_id(set_log_id)

    return {
        "status": "success",
        "message": "Set log deleted.",
    }
