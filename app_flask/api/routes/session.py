from time import sleep

from flask import session
from flask_imp.security import api_login_check

from .. import bp
from ...models.accounts import Accounts


@bp.get("/session")
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
    },
)
def session_():
    sleep(1)
    account_id = session.get("account_id", 0)
    theme = session.get("theme", "dark")
    email_address = (
        Accounts.get_email_address(account_id) if account_id != 0 else None
    )
    return {
        "status": "success",
        "message": "Session retrieved.",
        "logged_in": True,
        "account_id": account_id,
        "email_address": email_address,
        "theme": theme,
    }
