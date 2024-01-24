from flask import session

from app_flask.extensions import imp
from .. import bp


@bp.get("/logout")
def logout():
    session.clear()
    imp.init_session()
    return {"status": "success", "message": "You have been logged out."}
