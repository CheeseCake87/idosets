from .zepto import ZeptoEmailService, ZeptoEmailServiceSettings


def send_zepto_email(
        zepto_email_service_settings: ZeptoEmailServiceSettings,
        recipients: list[str],
        subject: str,
        body: str,
) -> None:
    e = ZeptoEmailService(zepto_email_service_settings)
    e.send(recipients=recipients, subject=subject, body=body)
