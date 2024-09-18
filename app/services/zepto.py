from typing import Union

import requests


class ZeptoEmailServiceSettings:
    dev_mode: bool
    sender: str
    api_url: str
    token: str

    def __init__(
            self,
            dev_mode: Union[int, str, bool],
            sender: str,
            api_url: str,
            token: str,
    ):
        truly = [1, "1", True, "True", "true"]
        self.dev_mode = True if dev_mode in truly else False
        self.sender = sender
        self.api_url = api_url
        self.token = token


class ZeptoEmailService:
    settings: ZeptoEmailServiceSettings

    def __init__(self, settings: ZeptoEmailServiceSettings):
        self.settings = settings

    def send(self, recipients: list[str], subject: str, body: str):
        if self.settings.dev_mode:
            print("ZeptoEmailService")
            print("Sender", self.settings.sender)
            print("API URL", self.settings.api_url)
            print("Recipients", recipients)
            print("Subject", subject)
            print("Body", body)
            return

        _url = self.settings.api_url

        _payload = {
            "from": {"address": self.settings.sender},
            "to": [
                {"email_address": {"address": recipient}}
                for recipient in recipients
            ],
            "subject": subject,
            "htmlbody": body,
        }

        _headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "authorization": self.settings.token,
        }

        requests.request("POST", _url, headers=_headers, json=_payload)
