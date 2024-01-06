import random
import timeit
from datetime import datetime
from datetime import timedelta

from pytz import timezone


def epoch(ltz: str = "Europe/London") -> int:
    """
    Returns EPOCH time for the defined local time zone (int)
    """
    local_tz = timezone(ltz)
    return int(datetime.timestamp(datetime.now(local_tz)))


class DatetimeDelta:
    # https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List

    _local_tz: str
    _format: str
    _timezone: timezone
    _datetime: datetime

    def __init__(
        self,
        ltz: str = "Europe/London",
        format_: str = "%Y-%m-%d %H:%M:%S",
        datetime_: datetime = None,
    ):
        self._local_tz = ltz
        self._format = format_
        self._timezone = timezone(ltz)
        if datetime_:
            self._datetime = datetime_
        else:
            self._datetime = datetime.now(self._timezone)

    def format(self, format_: str = "%Y-%m-%d %H:%M:%S") -> "DatetimeDelta":
        return DatetimeDelta(
            ltz=self._local_tz, format_=format_, datetime_=self._datetime
        )

    def days(self, days_delta: int) -> "DatetimeDelta":
        return DatetimeDelta(
            ltz=self._local_tz,
            format_=self._format,
            datetime_=self._datetime + timedelta(days=days_delta),
        )

    def hours(self, hours_delta: int) -> "DatetimeDelta":
        return DatetimeDelta(
            ltz=self._local_tz,
            format_=self._format,
            datetime_=self._datetime + timedelta(hours=hours_delta),
        )

    def minutes(self, minuets_delta: int) -> "DatetimeDelta":
        return DatetimeDelta(
            ltz=self._local_tz,
            format_=self._format,
            datetime_=self._datetime + timedelta(minutes=minuets_delta),
        )

    def __str__(self) -> str:
        return self._datetime.strftime(self._format)

    @property
    def datetime(self) -> datetime:
        return self._datetime


class DatetimeDeltaMC:
    # https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List

    _local_tz: str
    _format: str
    _timezone: timezone
    _datetime: datetime

    def __init__(
        self,
        ltz: str = "Europe/London",
        format_: str = "%Y-%m-%d %H:%M:%S",
        datetime_: datetime = None,
    ):
        self._local_tz = ltz
        self._format = format_
        self._timezone = timezone(ltz)
        if datetime_:
            self._datetime = datetime_
        else:
            self._datetime = datetime.now(self._timezone)

    def format(self, format_: str = "%Y-%m-%d %H:%M:%S") -> "DatetimeDeltaMC":
        self._format = format_
        return self

    def days(self, days_delta: int) -> "DatetimeDeltaMC":
        self._datetime = self._datetime + timedelta(days=days_delta)
        return self

    def hours(self, hours_delta: int) -> "DatetimeDeltaMC":
        self._datetime = self._datetime + timedelta(hours=hours_delta)
        return self

    def minutes(self, minuets_delta: int) -> "DatetimeDeltaMC":
        self._datetime = self._datetime + timedelta(minutes=minuets_delta)
        return self

    def __str__(self) -> str:
        return self._datetime.strftime(self._format)

    @property
    def datetime(self) -> datetime:
        return self._datetime


if __name__ == "__main__":
    def returning_new_inst():
        today = DatetimeDelta().format("%Y-%m-%d %H:%M:%S")
        today.days(random.randint(-10, 10)).hours(
            random.randint(-10, 10)
        ).minutes(random.randint(-10, 10))


    def returning_self():
        today = DatetimeDeltaMC().format("%Y-%m-%d %H:%M:%S")
        today.days(random.randint(-10, 10)).hours(
            random.randint(-10, 10)
        ).minutes(random.randint(-10, 10))


    print(timeit.timeit(stmt=returning_new_inst, number=10000))

    print(timeit.timeit(stmt=returning_self, number=10000))
