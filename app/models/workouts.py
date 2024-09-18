from app.resources.utilities.weight_converter import (
    grams_to_pounds,
    grams_to_kilograms,
)
from . import *
from .__mixins__ import UtilityMixin


class Workouts(db.Model, UtilityMixin):
    # PriKey
    workout_id = Column(Integer, primary_key=True)

    # ForKey
    account_id = Column(Integer, db.ForeignKey("accounts.account_id"))

    name = Column(String(255), nullable=False)

    created = Column(DateTime, nullable=False, default=DatetimeDelta().datetime)

    rel_exercises = relationship(
        "Exercises",
        viewonly=True,
        cascade="all, delete-orphan",
    )

    @classmethod
    def get_by_account_id(cls, account_id: int):
        q = select(cls).where(cls.account_id == account_id)
        return db.session.execute(q).scalars().all()

    @classmethod
    def get_session(
        cls,
        account_id: int,
        workout_id: int,
        workout_session_id: int,
        weight_unit: str = "kgs",
    ) -> dict:
        from app.models.exercises import Exercises
        from app.models.sets import Sets
        from app.models.set_logs import SetLogs
        from app.models.workout_sessions import WorkoutSessions

        converters = {"kgs": grams_to_kilograms, "lbs": grams_to_pounds}

        total_weight = 0

        workout_session = WorkoutSessions.um_as_jsonable_dict(
            select(WorkoutSessions).where(
                and_(
                    WorkoutSessions.account_id == account_id,
                    WorkoutSessions.workout_session_id == workout_session_id,
                )
            ),
            remove_return_key=True,
            one_or_none=True,
        )

        if not workout_session:
            return {
                "error": "Workout session not found.",
            }

        workout = cls.um_as_jsonable_dict(
            select(cls).where(
                and_(
                    cls.account_id == account_id,
                    cls.workout_id == workout_id,
                )
            ),
            remove_return_key=True,
            one_or_none=True,
        )

        if not workout:
            return {
                "error": "Workout not found.",
            }

        exercises = Exercises.um_as_jsonable_dict(
            select(Exercises)
            .where(
                and_(
                    Exercises.account_id == account_id,
                    Exercises.workout_id == workout_id,
                )
            )
            .order_by(asc(Exercises.order)),
            remove_return_key=True,
        )

        if not exercises.get("items"):
            return {
                "error": "Workout has no exercises.",
            }

        for exercise in exercises.get("items"):
            _sets = Sets.um_as_jsonable_dict(
                select(Sets)
                .where(
                    and_(
                        Sets.account_id == account_id,
                        Sets.exercise_id == exercise["exercise_id"],
                    )
                )
                .order_by(asc(Sets.order)),
                remove_return_key=True,
            )
            exercise["sets"] = _sets.get("items")
            for set_ in exercise["sets"]:
                set_["set_log"] = SetLogs.um_as_jsonable_dict(
                    select(SetLogs).where(
                        and_(
                            SetLogs.account_id == account_id,
                            SetLogs.set_id == set_["set_id"],
                            SetLogs.workout_session_id == workout_session_id,
                        )
                    ),
                    remove_return_key=True,
                    one_or_none=True,
                )
                if set_["set_log"]:
                    weight = set_["set_log"]["weight"]
                    set_["set_log"]["weight"] = converters.get(weight_unit)(
                        weight
                    )
                    total_weight += weight

        if workout_session["is_finished"]:
            workout_session["duration"] = (
                workout_session["finished"] - workout_session["started"]
            ).seconds
            workout_session["total_weight"] = converters.get(weight_unit)(
                total_weight
            )
        else:
            workout_session["duration"] = 0
            workout_session["total_weight"] = 0

        return {
            "workout_session": workout_session,
            "workout": workout,
            "exercises": exercises,
        }

    @classmethod
    def count_by_account_id(cls, account_id: int) -> int:
        return db.session.execute(
            select(func.count(cls.workout_id)).where(
                cls.account_id == account_id
            )
        ).scalar()

    @classmethod
    def select_all(cls, account_it: int):
        return cls.um_as_jsonable_dict(
            select(cls)
            .where(cls.account_id == account_it)
            .order_by(desc(cls.created)),
            relationships=["rel_exercises"],
        )

    @classmethod
    def select_by_id(cls, account_id, workout_id: int):
        return cls.um_as_jsonable_dict(
            select(cls).where(
                and_(
                    cls.account_id == account_id,
                    cls.workout_id == workout_id,
                )
            )
        )

    @classmethod
    def get_workout(cls, workout_id: int):
        return cls.um_as_jsonable_dict(
            select(cls).where(cls.workout_id == workout_id),
            one_or_none=True,
            remove_return_key=True,
        )
