from . import run
from app_flask.resources.utilities.email_service import (
    SMTPEmailService,
    EmailServiceSettings,
    ZeptoEmailService,
    ZeptoEmailServiceSettings,
)


@run.task()
def send_smtp_email(
    email_service_settings: EmailServiceSettings,
    recipients: list[str],
    subject: str,
    body: str,
) -> None:
    e = SMTPEmailService(email_service_settings)
    e.from_(f"idosets.app <{email_service_settings.username}>").recipients(
        recipients
    ).subject(subject).body(body).send()


@run.task()
def send_zepto_email(
    zepto_email_service_settings: ZeptoEmailServiceSettings,
    recipients: list[str],
    subject: str,
    body: str,
) -> None:
    e = ZeptoEmailService(zepto_email_service_settings)
    e.send(recipients=recipients, subject=subject, body=body)
