from flask import session, request, current_app, render_template
from flask_imp.auth import generate_private_key
from flask_imp.security import api_login_check

from app.models.accounts import Accounts
from app.models.exercises import Exercises
from app.models.sets import Sets
from app.models.workouts import Workouts
from .. import bp
from ...config import zepto_service_settings
from app.services import send_zepto_email
from ...utilities.datetime_delta import DatetimeDelta


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
    account = Accounts.um_read(session.get("account_id", 0), one_or_none=True)

    if account:
        pk = generate_private_key(f"{DatetimeDelta().datetime}{account.email_address}")
        account.update_auth_code(pk, DatetimeDelta().days(1).datetime)

        url = f"{current_app.config['SET_HOST_URL']}/account/delete"

        send_zepto_email(
            zepto_email_service_settings=zepto_service_settings,
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
        Accounts.um_delete(account_id)
        Workouts.um_delete(fields={"account_id": account_id})
        Exercises.um_delete(fields={"account_id": account_id})
        Sets.um_delete(fields={"account_id": account_id})

        session.clear()

        return {
            "status": "success",
            "message": "Account deleted.",
        }

    return {
        "status": "failed",
        "message": "Unable to delete account.",
    }
