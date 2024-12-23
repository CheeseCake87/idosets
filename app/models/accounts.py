from datetime import datetime

import pytz

from . import *
from .__mixins__ import UtilityMixin


class Accounts(db.Model, UtilityMixin):
    # PriKey
    account_id = Column(Integer, primary_key=True)

    email_address = Column(String(255), nullable=False)
    settings = Column(JSON, default={"theme": "dark", "units": "kgs"})
    auth_code = Column(String(512), nullable=True)
    auth_code_expiry = Column(DateTime, nullable=True)
    created = Column(DateTime, nullable=False, default=DatetimeDelta().datetime)

    def update_auth_code(self, auth_code: str, auth_code_expiry: datetime):
        self.auth_code = auth_code
        self.auth_code_expiry = auth_code_expiry
        db.session.commit()

    def remove_auth_code(self):
        self.auth_code = None
        self.auth_code_expiry = None
        db.session.commit()

    @classmethod
    def get_all_accounts(cls):
        q = select(cls)
        return db.session.execute(q).scalars().all()

    @classmethod
    def get_account(cls, email_address: str):
        q = select(cls).where(cls.email_address == email_address)
        return db.session.execute(q).scalar_one_or_none()

    @classmethod
    def get_account_by_id(cls, account_id: int):
        q = select(cls).where(cls.account_id == account_id)
        return db.session.execute(q).scalar_one_or_none()

    @classmethod
    def get_email_address(cls, account_id: int):
        q = select(cls.email_address).where(cls.account_id == account_id)
        return db.session.execute(q).scalar_one_or_none()

    @classmethod
    def get_account_info(cls, account_id: int):
        q = select(cls).where(cls.account_id == account_id)
        r = db.session.execute(q).scalar_one_or_none()
        offset_aware = pytz.UTC.localize(r.created)
        return {
            "email_address": r.email_address,
            "theme": r.settings.get("theme", "dark"),
            "days_old": (DatetimeDelta().datetime - offset_aware).days,
        }

    @classmethod
    def process_auth_code(cls, account_id: int, auth_code: str):
        q = select(cls).where(
            cls.account_id == account_id,
            cls.auth_code == auth_code
        )
        r = db.session.execute(q).scalar_one_or_none()

        if not r:
            return None

        if isinstance(r.auth_code_expiry, datetime):
            if DatetimeDelta().datetime < pytz.UTC.localize(r.auth_code_expiry):
                return r

        return None

    @classmethod
    def delete_account(cls, account_id: int):
        from app.models.exercises import Exercises
        from app.models.sets import Sets

        Exercises.delete_by_account_id(account_id)
        Sets.delete_by_account_id(account_id)

        q = delete(cls).where(cls.account_id == account_id)
        db.session.execute(q)
        db.session.commit()
