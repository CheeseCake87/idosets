from flask import session
from flask_imp.security import api_login_check

from app_flask.models.workouts import Workouts
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
