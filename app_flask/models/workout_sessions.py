import pytz

from . import *
from .__mixins__ import UtilityMixin
from .set_logs import SetLogs


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
        return cls.um_as_jsonable_dict(
            select(cls).where(
                and_(
                    cls.account_id == account_id,
                )
            )
        )

    @classmethod
    def active_sessions(cls, account_id: int) -> dict:
        return cls.um_as_jsonable_dict(
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
        return cls.um_as_jsonable_dict(
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

        db.session.commit()

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
