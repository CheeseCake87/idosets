from . import *
from .__mixins__ import UtilityMixin


class Sets(db.Model, UtilityMixin):
    # PriKey
    set_id = db.Column(db.Integer, primary_key=True)

    # ForKeys
    account_id = db.Column(db.Integer, db.ForeignKey("accounts.account_id"))
    workout_id = db.Column(db.Integer, db.ForeignKey("workouts.workout_id"))
    exercise_id = db.Column(db.Integer, db.ForeignKey("exercises.exercise_id"))

    weight = db.Column(db.Float, nullable=False)
    duration = db.Column(db.Float, nullable=False)
    reps = db.Column(db.Integer, nullable=False)


class SetLogs(db.Model, UtilityMixin):
    # PriKey
    set_log_id = db.Column(db.Integer, primary_key=True)

    # ForKeys
    account_id = db.Column(db.Integer, db.ForeignKey("accounts.account_id"))
    workout_id = db.Column(db.Integer, db.ForeignKey("workouts.workout_id"))
    exercise_id = db.Column(db.Integer, db.ForeignKey("exercises.exercise_id"))
    set_id = db.Column(db.Integer, db.ForeignKey("sets.set_id"))

    weight = db.Column(db.Float, nullable=False)
    duration = db.Column(db.Float, nullable=False)
    reps = db.Column(db.Integer, nullable=False)
