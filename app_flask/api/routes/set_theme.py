from flask import session

from .. import bp


@bp.get("/set/theme/<theme>")
def set_theme_(theme):
    allowed_themes = ["dark", "light"]
    session["theme"] = theme if theme in allowed_themes else "dark"
    return {
        "theme": session["theme"],
    }
