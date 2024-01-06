import time
from email.utils import parseaddr

from email_validator import validate_email, EmailNotValidError
from flask import request, session, current_app, render_template
from flask_imp.auth import generate_private_key
from flask_imp.security import api_login_check

from app_flask.huey.email_service import EmailServiceSettings
from app_flask.huey.tasks import send_email
from app_flask.models.accounts import Accounts
from app_flask.resources.utilities.datetime_delta import DatetimeDelta
from .. import bp


@bp.route("/", methods=["GET"])
def index():
    return {
        "API": "v1",
    }


@bp.get("/get/theme/")
def get_theme_():
    theme = session.get("theme", "dark")
    return {
        "theme": theme,
    }


@bp.get("/set/theme/<theme>")
def set_theme_(theme):
    allowed_themes = ["dark", "light"]
    session["theme"] = theme if theme in allowed_themes else "dark"
    return {
        "theme": theme,
    }


@bp.post("/auth")
def auth_():
    time.sleep(2)
    jsond = request.json

    auth_code = jsond.get("auth_code")

    account_ = Accounts.get_by_auth_code(auth_code)

    if account_:
        account_.remove_auth_code()
        session["logged_in"] = True
        session["account_id"] = account_.account_id
        return {"status": "passed", "message": "Logged in."}

    return {"status": "failed", "message": "Unable to log in."}


@bp.get("/check/login")
def check_login():
    time.sleep(2)
    if session.get("logged_in"):
        return {"status": "passed", "message": "Logged in."}
    return {"status": "failed", "message": "Not logged in."}


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
        dev_mode=False,
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
        Accounts.insert(
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
            body=render_template("welcome-email.html", url=url, auth=pk),
        )

    else:
        pk = generate_private_key(f"{DatetimeDelta().datetime}{email_address}")
        account.update_auth_code(pk, DatetimeDelta().days(1).datetime)

        send_email(
            email_service_settings,
            recipients=[email_address],
            subject="Welcome to idosets.app!",
            body=render_template("login-email.html", url=url, auth=pk),
        )

    return {"status": "success", "message": "Login email sent."}


@bp.get("/logout")
def logout():
    session.clear()
    return {"status": "success", "message": "You have been logged out."}


@bp.route("/workouts", methods=["GET"])
@api_login_check(
    "logged_in", True, {"status": "unauthorized", "message": "unauthorized"}
)
def workouts_():
    return {
        "status": "success",
        "Workouts": [
            {"workout_id": "1", "name": "Workout 1"},
            {"workout_id": "2", "name": "Workout 2"},
            {"workout_id": "3", "name": "Workout 3"},
        ],
    }
