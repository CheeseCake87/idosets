from email.utils import parseaddr

from email_validator import validate_email, EmailNotValidError
from flask import request, current_app, render_template
from flask_imp.auth import generate_private_key

from app_flask.huey.email_service import EmailServiceSettings
from app_flask.huey.tasks import send_email
from app_flask.models.accounts import Accounts
from app_flask.resources.utilities.datetime_delta import DatetimeDelta
from .. import bp


@bp.post("/login")
def login():
    jsond = request.json

    name, email_address = parseaddr(jsond.get("email_address"))

    if not email_address:
        return {"status": "error", "message": "Email address is not valid."}

    try:
        validate_email(email_address)
    except EmailNotValidError:
        return {"status": "error", "message": "Email address is not valid."}

    email_service_settings = EmailServiceSettings(
        dev_mode=True,
        username=current_app.config["ES_USERNAME"],
        password=current_app.config["ES_PASSWORD"],
        server=current_app.config["ES_SERVER"],
        port=current_app.config["ES_PORT"],
    )

    account = Accounts.get_account(email_address)
    url = (
        "http://localhost:3000/auth"
        if current_app.debug
        else "https://idosets.app/auth"
    )

    if not account:
        pk = generate_private_key(f"{DatetimeDelta().datetime}{email_address}")
        account, account_id = Accounts.insert(
            {
                "email_address": email_address,
                "settings": {"theme": "dark"},
                "auth_code": pk,
                "auth_code_expiry": DatetimeDelta().days(1).datetime,
            }
        )

        send_email(
            email_service_settings,
            recipients=[email_address],
            subject="Welcome to idosets.app!",
            body=render_template(
                "welcome-email.html",
                url=url,
                account_id=account_id,
                auth=pk,
            ),
        )

    else:
        pk = generate_private_key(f"{DatetimeDelta().datetime}{email_address}")
        account.update_auth_code(pk, DatetimeDelta().days(1).datetime)

        send_email(
            email_service_settings,
            recipients=[email_address],
            subject="Here's your login link!",
            body=render_template(
                "login-email.html",
                url=url,
                account_id=account.account_id,
                auth=pk,
            ),
        )

    return {"status": "success", "message": "Login email sent."}
