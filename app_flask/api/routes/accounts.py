from flask import session, request, current_app, render_template
from flask_imp.auth import generate_private_key
from flask_imp.security import api_login_check

from .. import bp
from app_flask.models.accounts import Accounts
from app_flask.models.workouts import Workouts
from app_flask.models.exercises import Exercises
from app_flask.models.sets import Sets
from ...huey.email_service import EmailServiceSettings
from ...huey.tasks import send_email
from ...resources.utilities.datetime_delta import DatetimeDelta


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


@bp.get("/account/send/delete")
@api_login_check(
    "logged_in", True, {"status": "unauthorized", "message": "unauthorized"}
)
def account_send_delete_():
    email_service_settings = EmailServiceSettings(
        dev_mode=True,
        username=current_app.config["ES_USERNAME"],
        password=current_app.config["ES_PASSWORD"],
        server=current_app.config["ES_SERVER"],
        port=current_app.config["ES_PORT"],
    )

    account = Accounts.get_by_key(session.get("account_id", 0))

    if account:
        url = (
            "http://localhost:3000/account/delete"
            if current_app.debug
            else "https://idosets.app/account/delete"
        )

        pk = generate_private_key(
            f"{DatetimeDelta().datetime}{account.email_address}"
        )
        account.update_auth_code(pk, DatetimeDelta().days(1).datetime)

        send_email(
            email_service_settings,
            recipients=[account.email_address],
            subject="Deleting your idosets.app account",
            body=render_template(
                "delete-account-email.html",
                url=url,
                account_id=account.account_id,
                auth=pk,
            ),
        )

        return {
            "status": "success",
            "message": "Account deletion email sent.",
        }

    return {
        "status": "failed",
        "message": "Unable to send account deletion email.",
    }


@bp.post("/account/delete")
@api_login_check(
    "logged_in", True, {"status": "unauthorized", "message": "unauthorized"}
)
def account_delete_():
    jsond = request.json

    account_id = jsond.get("account_id")
    auth_code = jsond.get("auth_code")

    _account = Accounts.process_auth_code(account_id, auth_code)

    if _account:
        Accounts.delete(account_id)
        Workouts.delete(fk=[("account_id", account_id)])
        Exercises.delete(fk=[("account_id", account_id)])
        Sets.delete(fk=[("account_id", account_id)])

        session.clear()

        return {
            "status": "success",
            "message": "Account deleted.",
        }

    return {
        "status": "failed",
        "message": "Unable to delete account.",
    }
