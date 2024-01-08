from flask import request, session

from app_flask.models.accounts import Accounts
from .. import bp


@bp.post("/auth")
def auth_():
    jsond = request.json

    account_id = jsond.get("account_id")
    auth_code = jsond.get("auth_code")

    account_ = Accounts.process_auth_code(account_id, auth_code)

    if account_:
        settings = account_.settings
        session["logged_in"] = True
        session["account_id"] = account_.account_id
        session["theme"] = settings.get("theme", "dark")

        return {
            "status": "passed",
            "message": "Logged in.",
        }

    return {
        "status": "failed",
        "message": "Unable to log in.",
    }


@bp.get("/check/login")
def check_login():
    if session.get("logged_in"):
        return {"status": "passed", "message": "Logged in."}
    return {"status": "failed", "message": "Not logged in."}
