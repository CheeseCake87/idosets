from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path
from smtplib import SMTP
from smtplib import SMTPException
from ssl import create_default_context
from typing import Optional, Union


class EmailServiceSettings:
    dev_mode: bool
    username: str
    password: str
    server: str
    port: int

    def __init__(
        self,
        dev_mode: Union[int, str, bool],
        username: str,
        password: str,
        server: str,
        port: int,
    ):
        """
        Dev_mode will prevent the email from being sent. It will print the email instead.

        Dev_mode: 1, "1", True, "True", "true" will set dev_mode to True, else False

        :param dev_mode:
        :param username:
        :param password:
        :param server:
        :param port:
        """
        truly = [1, "1", True, "True", "true"]
        self.dev_mode = True if dev_mode in truly else False
        self.username = username
        self.password = password
        self.server = server
        self.port = port


class EmailService:
    dev_mode: bool
    username: str
    password: str
    server: str
    port: int

    _subject: str
    _msg: Optional[MIMEMultipart]
    _msg_body: Optional[MIMEText]
    _original_sender: str
    _reply_to: str
    _from: str
    _recipients: set[str]
    _cc_recipients: set[str]
    _bcc_recipients: set[str]
    _attachments: set[tuple[Path, str]]

    def __init__(self, settings: EmailServiceSettings):
        self.dev_mode = settings.dev_mode
        self.username = settings.username
        self.password = settings.password
        self.server = settings.server
        self.port = settings.port

        self._subject = ""
        self._msg_body = MIMEText("")
        self._original_sender = settings.username
        self._reply_to = settings.username
        self._from = settings.username
        self._recipients = set()
        self._cc_recipients = set()
        self._bcc_recipients = set()
        self._attachments = set()

        self._msg = MIMEMultipart()
        self._msg.set_type("multipart/alternative")

    def _reset_values(self):
        self._subject = ""
        self._msg_body = MIMEText("")
        self._recipients = set()
        self._cc_recipients = set()
        self._bcc_recipients = set()
        self._attachments = set()

        self._msg = MIMEMultipart()
        self._msg.set_type("multipart/alternative")

    def __repr__(self) -> str:
        attachments = "\n".join(
            [f"{file} - {status}" for file, status in self._attachments]
        )
        return (
            f"<Class: EmailService>"
            f"\n{self._msg}\n"
            "Files set for attachment:\n"
            f"{attachments}"
        )

    def subject(
        self,
        subject: str,
    ) -> "EmailService":
        self._subject = subject
        return self

    def body(
        self,
        body: str,
    ) -> "EmailService":
        self._msg_body = MIMEText(body)
        self._msg_body.set_type("text/html")
        self._msg_body.set_param("charset", "UTF-8")
        self._msg.attach(self._msg_body)
        return self

    def reply_to(self, reply_to: str) -> "EmailService":
        self._msg.replace_header("Reply-To", reply_to)
        return self

    def from_(self, from_: str) -> "EmailService":
        self._from = from_
        return self

    def recipients(self, recipients: list[str]) -> "EmailService":
        self._recipients.update(set(recipients))
        if "To" in self._msg:
            self._msg.replace_header("To", ", ".join(self._recipients))
            return self

        self._msg.add_header("To", ", ".join(self._recipients))
        return self

    def cc_recipients(self, cc_recipients: list[str]) -> "EmailService":
        self._cc_recipients.update(set(cc_recipients))
        if "CC" in self._msg:
            self._msg.replace_header("CC", ", ".join(self._cc_recipients))
            return self

        self._msg.add_header("CC", ", ".join(self._cc_recipients))
        return self

    def bcc_recipients(self, bcc_recipients: list[str]) -> "EmailService":
        self._bcc_recipients.update(set(bcc_recipients))
        if "BCC" in self._msg:
            self._msg.replace_header("BCC", ", ".join(self._bcc_recipients))
            return self

        self._msg.add_header("BCC", ", ".join(self._bcc_recipients))
        return self

    def attach_files(self, files: list[str | Path]) -> "EmailService":
        for file in files:
            if isinstance(file, Path):
                filepath: Path = file
            else:
                filepath: Path = Path(file)

            self._attachments.update(
                [(filepath, "Exists" if filepath.exists() else "Missing")]
            )

            if filepath.exists():
                contents = MIMEApplication(
                    filepath.read_bytes(), _subtype=filepath.suffix
                )
                contents.add_header(
                    "Content-Disposition", "attachment", filename=filepath.name
                )
                self._msg.attach(contents)

        return self

    def attach_file(self, file: str | Path) -> "EmailService":
        self.attach_files([file])
        return self

    def send(self, debug: bool = False) -> bool:
        """
        Sends the email. If debug is True, it will print the email.
        :param debug:
        :return:
        """

        self._msg.add_header("Original-Sender", self._original_sender)
        self._msg.add_header("Reply-To", self._reply_to)
        self._msg.add_header("From", self._from)
        self._msg.add_header("Subject", self._subject)

        if self.dev_mode:
            print(self)
            self._reset_values()
            return True

        try:
            with SMTP(self.server, self.port) as connection:
                connection.starttls(context=create_default_context())
                connection.login(self.username, self.password)
                connection.sendmail(
                    self.username,
                    [
                        *self._recipients,
                        *self._cc_recipients,
                        *self._bcc_recipients,
                    ],
                    self._msg.as_string(),
                )
        except SMTPException as error:
            if debug:
                print(error)
                self._reset_values()

            return False

        if debug:
            print(self)

        self._reset_values()
        return True


# usage:
if __name__ == "__main__":
    email_service_settings = EmailServiceSettings(
        dev_mode=True,
        username="test@test.com",
        password="none",
        server="none.none.none",
        port=000,
    )

    email_service = EmailService(email_service_settings)
    email_service.from_("Test Person <test@test.com>")
    email_service.recipients(["recipient@test.com"])
    email_service.cc_recipients(["cc-recipient@test.com"])
    email_service.bcc_recipients(["bcc-recipient@test.com"])
    email_service.subject("Test Email Subject")
    email_service.body("Test Email Body")

    if email_service.send():
        print("Email sent!")
    else:
        print("Email failed to send!")

# additional:
"""
email_service.attach_files(
    [
        Path(Path.cwd() / "test1.txt"),
        Path(Path.cwd() / "test2.txt")
    ]
)
"""
