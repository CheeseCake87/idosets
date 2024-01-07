from . import run
from .email_service import EmailService, EmailServiceSettings


@run.task()
def send_email(
    email_service_settings: EmailServiceSettings,
    recipients: list[str],
    subject: str,
    body: str,
) -> None:
    e = EmailService(email_service_settings)
    e.from_(f"idosets.app <{email_service_settings.username}>").recipients(
        recipients
    ).subject(subject).body(body).send()
    return
