from . import *
from .__mixins__ import UtilityMixin


class Workouts(db.Model, UtilityMixin):
    workout_id = db.Column(db.Integer, primary_key=True)

    account_id = db.Column(db.Integer, db.ForeignKey("accounts.account_id"))

    name = db.Column(db.String(255), nullable=False)


class WorkoutLogs(db.Model, UtilityMixin):
    workout_log_id = db.Column(db.Integer, primary_key=True)

    account_id = db.Column(db.Integer, db.ForeignKey("accounts.account_id"))
    workout_id = db.Column(db.Integer, db.ForeignKey("workouts.workout_id"))

    created = db.Column(db.DateTime, nullable=False, default=DatetimeDelta().datetime)
    finished = db.Column(db.DateTime, nullable=False, default=DatetimeDelta().datetime)
