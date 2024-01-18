from flask import session, request
from flask_imp.security import api_login_check

from app_flask.models.sets import SetLogs
from app_flask.models.workouts import WorkoutSessions
from .. import bp


@bp.get("/sessions")
@api_login_check(
    "logged_in", True, {"status": "unauthorized", "message": "unauthorized"}
)
def sessions_():
    return {
        "status": "success",
        "message": "-",
        **WorkoutSessions.sessions(
            session.get("account_id", 0)
        ),
    }


@bp.get("/sessions/active")
@api_login_check(
    "logged_in", True, {"status": "unauthorized", "message": "unauthorized"}
)
def sessions_active_():
    return {
        "status": "success",
        "message": "-",
        **WorkoutSessions.active_sessions(
            session.get("account_id", 0)
        ),
    }


@bp.post("/sessions/start")
@api_login_check(
    "logged_in", True, {"status": "unauthorized", "message": "unauthorized"}
)
def sessions_start_():
    jsond = request.json

    workout_id = jsond.get("workout_id")

    session_ = WorkoutSessions.start_session(
        account_id=session.get("account_id", 0),
        workout_id=workout_id
    )
    return {
        "status": "success",
        "message": "Workout session started.",
        **session_,
    }


@bp.post("/sessions/stop")
@api_login_check(
    "logged_in", True, {"status": "unauthorized", "message": "unauthorized"}
)
def sessions_stop_(workout_id, workout_session_id):
    _ = workout_id

    session_ = WorkoutSessions.stop_session(
        account_id=session.get("account_id", 0),
        workout_session_id=workout_session_id
    )

    return {
        "status": "success",
        "message": "Workout edited successfully.",
        **session_,
    }


@bp.get("/sessions/get/<workout_session_id>")
@api_login_check(
    "logged_in", True, {"status": "unauthorized", "message": "unauthorized"}
)
def get_session_(workout_session_id):
    session_ = WorkoutSessions.get_session(
        account_id=session.get("account_id", 0),
        workout_session_id=workout_session_id
    )

    set_logs = SetLogs.get_by_workout_id(session_.get("workout_id", 0))

    return {
        "status": "success",
        "message": "-",
        **session_,
        **set_logs,
    }


@bp.delete("/sessions/delete/<workout_session_id>")
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
