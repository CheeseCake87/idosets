from datetime import datetime

from . import *
from .__mixins__ import UtilityMixin


class Accounts(db.Model, UtilityMixin):
    account_id = db.Column(db.Integer, primary_key=True)
    email_address = db.Column(db.String(255), nullable=False)
    settings = db.Column(db.JSON, default={"theme": "dark"})
    auth_code = db.Column(db.String(512), nullable=True)
    auth_code_expiry = db.Column(db.DateTime, nullable=True)

    def update_auth_code(self, auth_code: str, auth_code_expiry: datetime):
        self.auth_code = auth_code
        self.auth_code_expiry = auth_code_expiry
        db.session.commit()

    def remove_auth_code(self):
        self.auth_code = None
        self.auth_code_expiry = None
        db.session.commit()

    @classmethod
    def get_account(cls, email_address: str):
        q = select(cls).where(
            cls.email_address == email_address
        )
        return db.session.execute(q).scalar_one_or_none()

    @classmethod
    def get_by_auth_code(cls, auth_code: str):
        q = select(cls).where(
            cls.auth_code == auth_code, cls.auth_code_expiry > datetime.now()
        )
        return db.session.execute(q).scalar_one_or_none()
