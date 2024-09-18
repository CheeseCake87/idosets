from . import *
from .__mixins__ import UtilityMixin


class Sets(db.Model, UtilityMixin):
    # PriKey
    set_id = Column(Integer, primary_key=True)

    # ForKeys
    account_id = Column(Integer, db.ForeignKey("accounts.account_id"))
    workout_id = Column(Integer, db.ForeignKey("workouts.workout_id"))
    exercise_id = Column(Integer, db.ForeignKey("exercises.exercise_id"))

    is_duration = Column(db.Boolean, nullable=False, default=False)
    is_reps = Column(db.Boolean, nullable=False, default=False)

    duration_min = Column(Integer, nullable=False, default=0)  # secs
    duration_max = Column(Integer, nullable=False, default=0)  # secs
    reps_min = Column(Integer, nullable=False, default=0)
    reps_max = Column(Integer, nullable=False, default=0)
    order = Column(Integer, nullable=False, default=0)

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
        return cls.um_as_jsonable_dict(
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
        return cls.um_as_jsonable_dict(
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
        _sets = cls.um_as_jsonable_dict(q).get("sets", [])
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
