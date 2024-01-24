from email.utils import parseaddr

from email_validator import validate_email, EmailNotValidError
from flask import request, current_app, render_template
from flask_imp.auth import generate_private_key

from app_flask.huey.tasks import send_zepto_email
from app_flask.models.accounts import Accounts
from app_flask.resources.utilities.datetime_delta import DatetimeDelta
from app_flask.resources.utilities.email_service import (
    ZeptoEmailServiceSettings,
)
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

    account = Accounts.get_account(email_address)

    url = (
        f"{current_app.config['VITE_URL']}/auth"
        if current_app.debug
        else (
            f"{current_app.config['PREFERRED_URL_SCHEME']}://"
            f"{current_app.config['SERVER_NAME']}"
            "/auth"
        )
    )

    email_service_settings = ZeptoEmailServiceSettings(
        dev_mode=current_app.debug,
        sender=current_app.config["ZEPTO_MAIL_SENDER"],
        api_url=current_app.config["ZEPTO_MAIL_API_URL"],
        token=current_app.config["ZEPTO_MAIL_TOKEN"],
    )

    if not account:
        pk = generate_private_key(f"{DatetimeDelta().datetime}{email_address}")
        new_account, account_id = Accounts.insert(
            {
                "email_address": email_address,
                "settings": {"theme": "dark", "units": "kgs"},
                "auth_code": pk,
                "auth_code_expiry": DatetimeDelta().days(1).datetime,
            }
        )

        send_zepto_email(
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

        return {
            "status": "success",
            "message": "New account created, login email sent.",
        }

    pk = generate_private_key(f"{DatetimeDelta().datetime}{email_address}")
    account.update_auth_code(pk, DatetimeDelta().days(1).datetime)

    send_zepto_email(
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

    return {
        "status": "success",
        "message": "Login email sent.",
    }
