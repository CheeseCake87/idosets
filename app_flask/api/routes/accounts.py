from flask_imp.security import api_login_check

from .. import bp
from app_flask.models.accounts import Accounts
from app_flask.models.workouts import Workouts
from app_flask.models.exercises import Exercises
from app_flask.models.sets import Sets

@bp.get("/accounts/<account_id>")
@api_login_check(
    "logged_in", True, {"status": "unauthorized", "message": "unauthorized"}
)
def account_(account_id):
    jsonr = {
        "status": "success",
        "message": "Account found.",
        **Accounts.get_account_info(account_id),

    }
    return
