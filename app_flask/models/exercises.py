from . import *
from .__mixins__ import UtilityMixin


class Exercises(db.Model, UtilityMixin):
    # PriKey
    exercise_id = Column(Integer, primary_key=True)

    # ForKey
    account_id = Column(Integer, db.ForeignKey("accounts.account_id"))
    workout_id = Column(Integer, db.ForeignKey("workouts.workout_id"))

    order = Column(Integer, nullable=False, default=0)
    name = Column(String(255), nullable=False)
    info_url = Column(String, nullable=True)

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

    @classmethod
    def count_by_account_id(cls, account_id: int) -> int:
        return db.session.execute(
            select(func.count(cls.exercise_id)).where(
                cls.account_id == account_id
            )
        ).scalar()

    @classmethod
    def select_all(cls, account_it, workout_id):
        return cls.as_jsonable_dict(
            select(cls)
            .where(
                and_(
                    cls.account_id == account_it,
                    cls.workout_id == workout_id,
                )
            )
            .order_by(
                asc(cls.order),
            ),
            include_joins=["rel_sets"],
        )

    @classmethod
    def select_by_id(cls, account_id, workout_id, exercise_id):
        return cls.as_jsonable_dict(
            select(cls).where(
                and_(
                    cls.account_id == account_id,
                    cls.workout_id == workout_id,
                    cls.exercise_id == exercise_id,
                )
            )
        )

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
