from . import *
from .__mixins__ import UtilityMixin


class Workouts(db.Model, UtilityMixin):
    # PriKey
    workout_id = db.Column(db.Integer, primary_key=True)

    # ForKey
    account_id = db.Column(db.Integer, db.ForeignKey("accounts.account_id"))

    name = db.Column(db.String(255), nullable=False)

    created = db.Column(
        db.DateTime, nullable=False, default=DatetimeDelta().datetime
    )

    rel_workoutLogs = relationship(
        "WorkoutLogs",
        viewonly=True,
        cascade="all, delete-orphan",
    )

    rel_exercises = relationship(
        "Exercises",
        viewonly=True,
        cascade="all, delete-orphan",
    )

    @classmethod
    def count_by_account_id(cls, account_id: int) -> int:
        return db.session.execute(
            select(func.count(cls.workout_id))
            .where(cls.account_id == account_id)
        ).scalar()

    @classmethod
    def select_all(cls, account_it: str):
        return cls.as_jsonable_dict(
            select(cls)
            .where(cls.account_id == account_it)
            .order_by(desc(cls.created)),
            include_joins=["rel_exercises"],
        )

    @classmethod
    def select_by_id(cls, account_id, workout_id: str):
        return cls.as_jsonable_dict(
            select(cls).where(
                and_(
                    cls.account_id == account_id,
                    cls.workout_id == workout_id,
                )
            )
        )


class WorkoutLogs(db.Model, UtilityMixin):
    # PriKey
    workout_log_id = db.Column(db.Integer, primary_key=True)

    # ForKey
    account_id = db.Column(db.Integer, db.ForeignKey("accounts.account_id"))
    workout_id = db.Column(db.Integer, db.ForeignKey("workouts.workout_id"))

    started = db.Column(
        db.DateTime, nullable=False, default=DatetimeDelta().datetime
    )
    finished = db.Column(db.DateTime, nullable=True, default=None)
