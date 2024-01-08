from .. import bp


@bp.route("/", methods=["GET"])
def index():
    return {
        "API": "v1",
    }
