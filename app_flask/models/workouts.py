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
    def count_by_account_id(cls, account_id: int) -> int:
        return db.session.execute(
            select(func.count(cls.workout_id)).where(
                cls.account_id == account_id
            )
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


class WorkoutSessions(db.Model, UtilityMixin):
    # PriKey
    workout_session_id = Column(Integer, primary_key=True)

    # ForKey
    account_id = Column(Integer, db.ForeignKey("accounts.account_id"))
    workout_id = Column(Integer, db.ForeignKey("workouts.workout_id"))

    started = Column(DateTime, nullable=False, default=DatetimeDelta().datetime)
    finished = Column(DateTime, nullable=True, default=None)
    is_finished = Column(Boolean, nullable=False, default=False)

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
            )
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
        q = insert(cls).values(
            account_id=account_id,
            workout_id=workout_id,
            started=DatetimeDelta().datetime,
            finished=None,
            is_finished=False,
        ).returning(cls)
        r = db.session.execute(q).scalar()
        return {
            "workout_session_id": r.workout_session_id,
            "finished": None,
            "started": r.started,
            "is_finished": r.is_finished,
        }

    @classmethod
    def stop_session(cls, account_id: int, workout_session_id: int) -> dict:
        q = update(cls).where(
            and_(
                cls.account_id == account_id,
                cls.workout_session_id == workout_session_id,
            )
        ).values(
            finished=DatetimeDelta().datetime,
            is_finished=True,
        ).returning(cls)
        r = db.session.execute(q).scalar()
        duration = (r.finished - r.started)
        return {
            "workout_session_id": r.workout_session_id,
            "started": r.started,
            "finished": r.finished,
            "duration": duration.second,
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
