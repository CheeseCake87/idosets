from app_flask.resources.utilities.weight_converter import (
    pounds_to_grams,
    kilograms_to_grams,
)
from . import *
from .__mixins__ import UtilityMixin


class SetLogs(db.Model, UtilityMixin):
    # PriKey
    set_log_id = Column(Integer, primary_key=True)

    # Indexes
    workout_session_id = Column(
        Integer, db.ForeignKey("workout_sessions.workout_session_id")
    )
    account_id = Column(Integer, db.ForeignKey("accounts.account_id"))
    workout_id = Column(Integer, db.ForeignKey("workouts.workout_id"))
    exercise_id = Column(Integer, db.ForeignKey("exercises.exercise_id"))
    set_id = Column(Integer, db.ForeignKey("sets.set_id"))

    weight = Column(Float, nullable=True)  # In grams
    duration = Column(Integer, nullable=True)
    reps = Column(Integer, nullable=True)

    @classmethod
    def get_by_workout_id(cls, workout_id):
        return cls.um_as_jsonable_dict(
            select(cls).where(
                cls.workout_id == workout_id,
            )
        )

    @classmethod
    def delete_by_set_log_id(cls, set_log_id):
        db.session.execute(
            delete(cls).where(
                cls.set_log_id == set_log_id,
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
    def delete_all_by_exercise_id(cls, exercise_id: int):
        db.session.execute(
            delete(cls).where(
                cls.exercise_id == exercise_id,
            )
        )
        db.session.commit()

    @classmethod
    def add_log(
        cls,
        account_id=0,
        workout_session_id=0,
        workout_id=0,
        exercise_id=0,
        set_id=0,
        weight=0.0,
        duration=0,
        reps=0,
        weight_unit="kgs",
    ):
        converters = {"kgs": kilograms_to_grams, "lbs": pounds_to_grams}
        q = (
            insert(cls)
            .values(
                {
                    "account_id": account_id,
                    "workout_session_id": workout_session_id,
                    "workout_id": workout_id,
                    "exercise_id": exercise_id,
                    "set_id": set_id,
                    "weight": converters.get(weight_unit)(weight),
                    "duration": duration,
                    "reps": reps,
                }
            )
            .returning(cls.set_log_id)
        )
        _set_log_id = db.session.execute(q).scalar()
        db.session.commit()
        return _set_log_id
