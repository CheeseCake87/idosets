from . import *
from .__mixins__ import UtilityMixin


class Exercises(db.Model, UtilityMixin):
    # PriKey
    exercise_id = db.Column(db.Integer, primary_key=True)

    # ForKey
    account_id = db.Column(db.Integer, db.ForeignKey("accounts.account_id"))
    workout_id = db.Column(db.Integer, db.ForeignKey("workouts.workout_id"))

    order = db.Column(db.Integer, nullable=False, default=0)
    name = db.Column(db.String(255), nullable=False)
    info_url = db.Column(db.String, nullable=True)

    rel_workouts = relationship(
        "Workouts",
        viewonly=True,
        cascade="all, delete-orphan",
    )

    rel_sets = relationship(
        "Sets",
        viewonly=True,
        cascade="all, delete-orphan",
    )

    rel_exerciseLogs = relationship(
        "ExerciseLogs",
        viewonly=True,
        cascade="all, delete-orphan",
    )

    @classmethod
    def select_all(cls, account_id, workout_id):
        return cls.as_jsonable_dict(
            select(cls).where(
                and_(
                    cls.account_id == account_id,
                    cls.workout_id == workout_id,
                )
            ),
            include_joins=["rel_sets"],
        )


class ExerciseLogs(db.Model, UtilityMixin):
    # PriKey
    exercise_log_id = db.Column(db.Integer, primary_key=True)

    # ForKey
    account_id = db.Column(db.Integer, db.ForeignKey("accounts.account_id"))
    workout_id = db.Column(db.Integer, db.ForeignKey("workouts.workout_id"))
    exercise_id = db.Column(db.Integer, db.ForeignKey("exercises.exercise_id"))

    started = db.Column(
        db.DateTime, nullable=False, default=DatetimeDelta().datetime
    )
    finished = db.Column(db.DateTime, nullable=True, default=None)
