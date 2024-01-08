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
        "account_id": 0,
        "email_address": None,
        "theme": "dark",
    },
)
def session_():
    account_id = session.get("account_id", 0)
    theme = session.get("theme", "dark")
    email_address = (
        Accounts.get_email_address(account_id) if account_id != 0 else None
    )

    print(account_id, theme, email_address)

    return {
        "status": "success",
        "account_id": account_id,
        "email_address": email_address,
        "theme": theme,
    }
