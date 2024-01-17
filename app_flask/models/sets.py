from . import *
from .__mixins__ import UtilityMixin


class Sets(db.Model, UtilityMixin):
    # PriKey
    set_id = db.Column(db.Integer, primary_key=True)

    # ForKeys
    account_id = db.Column(db.Integer, db.ForeignKey("accounts.account_id"))
    workout_id = db.Column(db.Integer, db.ForeignKey("workouts.workout_id"))
    exercise_id = db.Column(db.Integer, db.ForeignKey("exercises.exercise_id"))

    is_duration = db.Column(db.Boolean, nullable=False, default=False)
    is_reps = db.Column(db.Boolean, nullable=False, default=False)

    duration = db.Column(db.Integer, nullable=False, default=0)  # secs
    reps = db.Column(db.Integer, nullable=False, default=0)
    order = db.Column(db.Integer, nullable=False, default=0)

    @classmethod
    def count_by_account_id(cls, account_id: int) -> int:
        return db.session.execute(
            select(func.count(cls.set_id)).where(cls.account_id == account_id)
        ).scalar()

    @classmethod
    def count_by_exercise_id(cls, exercise_id: int) -> int:
        return db.session.execute(
            select(func.count(cls.set_id)).where(cls.exercise_id == exercise_id)
        ).scalar()

    @classmethod
    def select_all(cls, account_it, workout_id, exercise_id):
        return cls.as_jsonable_dict(
            select(cls)
            .where(
                and_(
                    cls.account_id == account_it,
                    cls.workout_id == workout_id,
                    cls.exercise_id == exercise_id,
                )
            )
            .order_by(
                asc(cls.order),
            )
        )

    @classmethod
    def select_by_id(cls, account_id, workout_id, exercise_id, set_id):
        return cls.as_jsonable_dict(
            select(cls).where(
                and_(
                    cls.account_id == account_id,
                    cls.workout_id == workout_id,
                    cls.exercise_id == exercise_id,
                    cls.set_id == set_id,
                )
            )
        )

    @classmethod
    def fix_order(cls, account_id, workout_id, exercise_id):
        q = select(cls).where(
            and_(
                cls.account_id == account_id,
                cls.workout_id == workout_id,
                cls.exercise_id == exercise_id,
            )
        )
        _sets = cls.as_jsonable_dict(q).get("sets", [])
        if _sets:
            for i, _set in enumerate(_sets):
                _set.order = i
                db.session.commit()
            return _sets
        return []

    @classmethod
    def delete_all_by_exercise_id(cls, exercise_id: int):
        db.session.execute(
            delete(cls).where(
                cls.exercise_id == exercise_id,
            )
        )
        db.session.commit()

    @classmethod
    def delete_all_by_workout_id(cls, workout_id: int):
        db.session.execute(
            delete(cls).where(
                cls.workout_id == workout_id,
            )
        )
        db.session.commit()

    @classmethod
    def delete_by_account_id(cls, account_id: int):
        db.session.execute(
            delete(cls).where(
                cls.account_id == account_id,
            )
        )
        db.session.commit()

    @classmethod
    def delete_by_id(cls, set_id: int):
        db.session.execute(
            delete(cls).where(
                cls.set_id == set_id,
            )
        )
        db.session.commit()


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
