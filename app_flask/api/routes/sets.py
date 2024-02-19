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
    duration_min = jsond.get("duration_min", 0)
    duration_max = jsond.get("duration_max", 0)
    reps_min = jsond.get("reps_min", 0)
    reps_max = jsond.get("reps_max", 0)
    order = jsond.get("order")

    _set = Sets.um_create(
        {
            "account_id": account_id,
            "workout_id": workout_id,
            "exercise_id": exercise_id,
            "is_duration": True if type_ == "duration" else False,
            "is_reps": True if type_ == "reps" else False,
            "order": order,
            "duration_min": duration_min,
            "duration_max": duration_max,
            "reps_min": reps_min,
            "reps_max": reps_max,
        },
        allow_none=True,
        return_record=True,
    )
    return {
        "status": "success",
        "message": "Set added successfully.",
        "set_id": _set.set_id,
    }


@bp.get("/workouts/<workout_id>/exercises/<exercise_id>/sets/<set_id>/copy")
@api_login_check(
    "logged_in", True, {"status": "unauthorized", "message": "unauthorized"}
)
def set_copy_(workout_id, exercise_id, set_id):
    _ = workout_id
    to_copy = Sets.um_read(set_id, one_or_none=True)
    count = Sets.count_by_exercise_id(exercise_id)
    _set = Sets.um_create(
        {
            "account_id": to_copy.account_id,
            "workout_id": to_copy.workout_id,
            "exercise_id": to_copy.exercise_id,
            "is_duration": to_copy.is_duration,
            "is_reps": to_copy.is_reps,
            "order": count + 1,
            "duration_min": to_copy.duration_min,
            "duration_max": to_copy.duration_max,
            "reps_min": to_copy.reps_min,
            "reps_max": to_copy.reps_max,
        },
        allow_none=True,
        return_record=True,
    )
    return {
        "status": "success",
        "message": "Set added successfully.",
        "set_id": _set.set_id,
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
