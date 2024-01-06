from . import *
from .__mixins__ import UtilityMixin


class Exercises(db.Model, UtilityMixin):
    exercise_id = db.Column(db.Integer, primary_key=True)

    account_id = db.Column(db.Integer, db.ForeignKey("accounts.account_id"))
    workout_id = db.Column(db.Integer, db.ForeignKey("workouts.workout_id"))

    name = db.Column(db.String(255), nullable=False)


class ExerciseLogs(db.Model, UtilityMixin):
    exercise_log_id = db.Column(db.Integer, primary_key=True)

    account_id = db.Column(db.Integer, db.ForeignKey("accounts.account_id"))
    workout_id = db.Column(db.Integer, db.ForeignKey("workouts.workout_id"))
    exercise_id = db.Column(db.Integer, db.ForeignKey("exercises.exercise_id"))

    created = db.Column(db.DateTime, nullable=False, default=DatetimeDelta().datetime)
    finished = db.Column(db.DateTime, nullable=False, default=DatetimeDelta().datetime)
