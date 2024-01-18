from flask import session

from .. import bp


@bp.get("/set/units/<unit>")
def set_units_(unit):
    allowed_units = ["kgs", "lbs"]
    session["units"] = unit if unit in allowed_units else "kgs"
    return {
        "units": session["units"],
    }
