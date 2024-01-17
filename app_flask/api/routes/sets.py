from flask import session, request
from flask_imp.security import api_login_check

from app_flask.models.exercises import Exercises
from app_flask.models.workouts import Workouts
from .. import bp
from ...models.sets import Sets


@bp.get("/workouts/<workout_id>/exercises/<exercise_id>/sets")
@api_login_check(
    "logged_in", True, {"status": "unauthorized", "message": "unauthorized"}
)
def sets_(workout_id, exercise_id):
    _sets = Sets.select_all(
        session.get("account_id", 0), workout_id, exercise_id
    )
    return {"status": "success", **_sets}


@bp.get("/workouts/<workout_id>/exercises/<exercise_id>/sets/<set_id>")
@api_login_check(
    "logged_in", True, {"status": "unauthorized", "message": "unauthorized"}
)
def set_(workout_id, exercise_id, set_id):
    _workout = Workouts.select_by_id(session.get("account_id", 0), workout_id)
    _exercise = Exercises.select_by_id(
        session.get("account_id", 0),
        workout_id,
        exercise_id,
    )
    _sets = Sets.select_by_id(
        session.get("account_id", 0), workout_id, exercise_id, set_id
    )
    return {"status": "success", **_workout, **_exercise, **_sets}


@bp.post("/workouts/<workout_id>/exercises/<exercise_id>/sets/add")
@api_login_check(
    "logged_in", True, {"status": "unauthorized", "message": "unauthorized"}
)
def set_add_(workout_id, exercise_id):
    jsond = request.json

    account_id = session.get("account_id", 0)

    type_ = jsond.get("type")
    duration = jsond.get("duration")
    reps = jsond.get("reps")
    order = jsond.get("order")

    if duration or reps:
        _set, _set_id = Sets.insert(
            {
                "account_id": account_id,
                "workout_id": workout_id,
                "exercise_id": exercise_id,
                "is_duration": True if type_ == "duration" else False,
                "is_reps": True if type_ == "reps" else False,
                "order": order,
                "duration": duration,
                "reps": reps,
            },
            allow_none=True,
        )
        return {
            "status": "success",
            "message": "Set added successfully.",
            "set_id": _set_id,
        }


@bp.get("/workouts/<workout_id>/exercises/<exercise_id>/sets/<set_id>/copy")
@api_login_check(
    "logged_in", True, {"status": "unauthorized", "message": "unauthorized"}
)
def set_copy_(workout_id, exercise_id, set_id):
    _ = workout_id
    to_copy = Sets.get_by_key(set_id)
    count = Sets.count_by_exercise_id(exercise_id)
    _set, _set_id = Sets.insert(
        {
            "account_id": to_copy.account_id,
            "workout_id": to_copy.workout_id,
            "exercise_id": to_copy.exercise_id,
            "is_duration": to_copy.is_duration,
            "is_reps": to_copy.is_reps,
            "order": count + 1,
            "duration": to_copy.duration,
            "reps": to_copy.reps,
        },
        allow_none=True,
    )
    return {
        "status": "success",
        "message": "Set added successfully.",
        "set_id": _set_id,
    }


@bp.post("/workouts/<workout_id>/exercises/<exercise_id>/sets/<set_id>/edit")
@api_login_check(
    "logged_in", True, {"status": "unauthorized", "message": "unauthorized"}
)
def sets_edit_(workout_id, exercise_id, set_id):
    jsond = request.json
    _set = Sets.update_(
        {
            "workout_id": workout_id,
            "exercise_id": exercise_id,
            "set_id": set_id,
            **jsond,
        }
    )
    return {
        "status": "success",
        "message": "Set edited successfully.",
        "set_id": _set.get("set_id"),
    }


@bp.delete(
    "/workouts/<workout_id>/exercises/<exercise_id>/sets/<set_id>/delete"
)
@api_login_check(
    "logged_in", True, {"status": "unauthorized", "message": "unauthorized"}
)
def sets_delete_(workout_id, exercise_id, set_id):
    Sets.delete_by_id(set_id)
    Sets.fix_order(session.get("account_id", 0), workout_id, exercise_id)

    return {
        "status": "success",
        "message": "Set deleted successfully.",
        "set_id": set_id,
    }
