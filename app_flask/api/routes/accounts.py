from flask import session
from flask_imp.security import api_login_check

from .. import bp
from app_flask.models.accounts import Accounts
from app_flask.models.workouts import Workouts
from app_flask.models.exercises import Exercises
from app_flask.models.sets import Sets


@bp.get("/account")
@api_login_check(
    "logged_in", True, {"status": "unauthorized", "message": "unauthorized"}
)
def account_():
    account_id = session.get("account_id")
    if account_id:
        return {
            "status": "success",
            "message": "Account found.",
            **Accounts.get_account_info(account_id),
            "total_workouts": Workouts.count_by_account_id(account_id),
            "total_exercises": Exercises.count_by_account_id(account_id),
            "total_sets": Sets.count_by_account_id(account_id),
        }

    return {
        "status": "failed",
        "message": "Account not found.",
        "account_id": 0,
    }
