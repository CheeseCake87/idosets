import pytz

from . import *
from .__mixins__ import UtilityMixin

from app_flask.resources.utilities.weight_converter import (
    grams_to_pounds,
    grams_to_kilograms,
)


class WorkoutSessions(db.Model, UtilityMixin):
    # PriKey
    workout_session_id = Column(Integer, primary_key=True)

    # ForKey
    account_id = Column(Integer, db.ForeignKey("accounts.account_id"))
    workout_id = Column(Integer, db.ForeignKey("workouts.workout_id"))

    started = Column(DateTime, nullable=False, default=DatetimeDelta().datetime)
    finished = Column(DateTime, nullable=True, default=None)
    is_finished = Column(Boolean, nullable=False, default=False)
    duration = Column(Integer, nullable=True, default=0)

    @classmethod
    def get_last_session(cls, account_id: int) -> dict:
        q = (
            select(cls)
            .where(
                and_(
                    cls.account_id == account_id,
                    cls.is_finished == True,
                )
            )
            .order_by(desc(cls.finished))
        )
        r = db.session.execute(q).scalars().first()
        return (
            {
                "workout_session_id": r.workout_session_id,
                "workout_id": r.workout_id,
                "started": r.started,
                "finished": r.finished,
                "duration": r.duration,
            }
            if r
            else None
        )

    @classmethod
    def sessions(cls, account_id: int) -> dict:
        return cls.as_jsonable_dict(
            select(cls).where(
                and_(
                    cls.account_id == account_id,
                )
            )
        )

    @classmethod
    def active_sessions(cls, account_id: int) -> dict:
        return cls.as_jsonable_dict(
            select(cls).where(
                and_(
                    cls.account_id == account_id,
                    cls.is_finished == False,
                )
            ),
            remove_return_key=True,
            one_or_none=True,
        )

    @classmethod
    def get_session(cls, account_id: int, workout_session_id: int) -> dict:
        return cls.as_jsonable_dict(
            select(cls).where(
                and_(
                    cls.account_id == account_id,
                    cls.workout_session_id == workout_session_id,
                )
            ),
            one_or_none=True,
            remove_return_key=True,
        )

    @classmethod
    def start_session(cls, account_id: int, workout_id: int) -> dict:
        q = (
            insert(cls)
            .values(
                account_id=account_id,
                workout_id=workout_id,
                started=DatetimeDelta().datetime,
                finished=None,
                is_finished=False,
            )
            .returning(cls)
        )
        r = db.session.execute(q).scalar()
        db.session.commit()
        return {
            "workout_session_id": r.workout_session_id,
            "finished": None,
            "started": r.started,
            "is_finished": r.is_finished,
        }

    @classmethod
    def stop_session(cls, account_id: int, workout_session_id: int) -> dict:
        q = select(cls).where(
            and_(
                cls.account_id == account_id,
                cls.workout_session_id == workout_session_id,
            )
        )
        r = db.session.execute(q).scalar()

        started = pytz.UTC.localize(r.started)
        finished = DatetimeDelta().datetime
        duration = (finished - started).seconds

        r.finished = finished
        r.duration = duration
        r.is_finished = True

        db.session.commit()
        return {
            "workout_session_id": r.workout_session_id,
            "started": r.started,
            "finished": r.finished,
            "duration": duration,
            "is_finished": r.is_finished,
        }

    @classmethod
    def delete_session(cls, account_id: int, workout_session_id: int) -> dict:
        from app_flask.models.sets import SetLogs

        db.session.execute(
            delete(cls).where(
                and_(
                    cls.account_id == account_id,
                    cls.workout_session_id == workout_session_id,
                )
            )
        )
        db.session.execute(
            delete(SetLogs).where(
                SetLogs.workout_session_id == workout_session_id,
            )
        )

        return {
            "session_id": workout_session_id,
        }

    @classmethod
    def delete_all_by_workout_id(cls, workout_id: int):
        db.session.execute(
            delete(cls).where(
                cls.workout_id == workout_id,
            )
        )
        db.session.commit()


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
    def get_session(
        cls,
        account_id: int,
        workout_id: int,
        workout_session_id: int,
        weight_unit: str = "kgs",
    ) -> dict:
        from app_flask.models.exercises import Exercises
        from app_flask.models.sets import Sets, SetLogs

        converters = {"kgs": grams_to_kilograms, "lbs": grams_to_pounds}

        total_weight = 0

        workout_session = WorkoutSessions.as_jsonable_dict(
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

        workout = cls.as_jsonable_dict(
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

        exercises = Exercises.as_jsonable_dict(
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

        if not exercises:
            return {
                "error": "Workout has no exercises.",
            }

        for exercise in exercises:
            exercise["sets"] = Sets.as_jsonable_dict(
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
            for set_ in exercise["sets"]:
                set_["set_log"] = SetLogs.as_jsonable_dict(
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
        return cls.as_jsonable_dict(
            select(cls)
            .where(cls.account_id == account_it)
            .order_by(desc(cls.created)),
            include_joins=["rel_exercises"],
        )

    @classmethod
    def select_by_id(cls, account_id, workout_id: int):
        return cls.as_jsonable_dict(
            select(cls).where(
                and_(
                    cls.account_id == account_id,
                    cls.workout_id == workout_id,
                )
            )
        )

    @classmethod
    def get_workout(cls, workout_id: int):
        return cls.as_jsonable_dict(
            select(cls).where(cls.workout_id == workout_id),
            one_or_none=True,
            remove_return_key=True,
        )
