from flask import request, session
from flask_imp.security import api_login_check

from app.models.accounts import Accounts
from .. import bp


@bp.post("/auth")
def auth_():
    jsond = request.json

    account_id = jsond.get("account_id")
    auth_code = jsond.get("auth_code")

    account_ = Accounts.process_auth_code(account_id, auth_code)

    if account_:
        if not account_.auth_code:
            return {
                "status": "failed",
                "message": "Auth code expired. Please log in again.",
            }

        settings = account_.settings

        session["logged_in"] = True
        session["account_id"] = account_.account_id
        session["theme"] = settings.get("theme", "dark")
        session["units"] = settings.get("units", "kgs")

        return {
            "status": "passed",
            "message": "Logged in.",
            "account_id": account_.account_id,
            "email_address": account_.email_address,
            "theme": settings.get("theme", "dark"),
            "units": settings.get("units", "kgs"),
        }

    return {
        "status": "failed",
        "message": "Unable to log in.",
    }


@bp.get("/auth/session")
@api_login_check(
    "logged_in",
    True,
    {
        "status": "unauthorized",
        "message": "unauthorized",
        "logged_in": False,
        "account_id": 0,
        "email_address": None,
        "theme": "dark",
        "units": "kgs",
    },
)
def session_():
    account_id = session.get("account_id", 0)
    theme = session.get("theme", "dark")
    units = session.get("units", "kgs")
    account = Accounts.get_account_by_id(account_id)

    if account:
        return {
            "status": "success",
            "message": "Session retrieved.",
            "logged_in": True,
            "account_id": account_id,
            "email_address": account.email_address,
            "theme": theme,
            "units": units,
        }

    return {
        "status": "failed",
        "message": "Account not found.",
    }


@bp.get("/auth/check/login")
def check_login():
    if session.get("logged_in"):
        return {"status": "passed", "message": "Logged in."}
    return {"status": "failed", "message": "Not logged in."}

# @bp.get("/auth/force/login")
# def force_login():
#     session["logged_in"] = True
#     session["account_id"] = 1
#     session["theme"] = "dark"
#     session["units"] = "kgs"
#     return {
#         "status": "passed",
#         "message": "Logged in.",
#         "account_id": 1,
#         "email_address": "test@test.com",
#         "theme": "dark",
#         "units": "kgs",
#     }
