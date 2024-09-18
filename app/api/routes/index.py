from flask import abort

from .. import bp


@bp.route("/", methods=["GET"])
def index():
    return {
        "API": "v1",
    }


@bp.route("/fake-error", methods=["GET"])
def fake_error():
    return abort(500)
