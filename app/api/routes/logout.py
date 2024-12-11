from flask import session

from app.extensions import imp
from .. import bp


@bp.get("/logout")
def logout():
    session.clear()
    return {"status": "success", "message": "You have been logged out."}
