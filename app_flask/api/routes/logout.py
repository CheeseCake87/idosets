from flask import session

from .. import bp


@bp.get("/logout")
def logout():
    session.clear()
    return {"status": "success", "message": "You have been logged out."}
