from datetime import datetime, date
import typing as t

from sqlalchemy import (
    Result,
    Select,
    Insert,
    Update,
    Delete,
    select,
    insert,
    update,
    delete,
    func,
)
from sqlalchemy.engine import Row
from sqlalchemy.inspection import inspect
from sqlalchemy.orm import collections
from sqlalchemy.sql import sqltypes

from app_flask.extensions import db


def parse(value, type_):
    if isinstance(type_, sqltypes.DateTime):
        if isinstance(value, datetime):
            return value, value.isoformat()

        if isinstance(value, date):
            return datetime.combine(
                value, datetime.min.time()
            ), value.isoformat()

        if isinstance(value, str):
            try:
                _ = datetime.strptime(value, "%Y-%m-%d")
                return _, _.isoformat()
            except Exception as e:
                _ = e

            try:
                _ = datetime.strptime(value, "%Y-%m-%dT%H:%M:%S")
                return _, _.isoformat()
            except Exception as e:
                _ = e

            try:
                _ = datetime.strptime(value, "%Y-%m-%dT%H:%M:%S.%f")
                return _, _.isoformat()
            except Exception as e:
                _ = e

    if isinstance(type_, sqltypes.Integer):
        try:
            return int(value), int(value)
        except Exception as e:
            _ = e

    if isinstance(type_, sqltypes.Boolean):
        if isinstance(value, bool):
            return value, value
        if isinstance(value, str):
            if value.lower() in ["yes", "true", "t", "1"]:
                return True, True
            return False, False
        if isinstance(value, int):
            if value == 1:
                return True, True
            return False, False

    return value, value


class UtilityMixin:
    @classmethod
    def update_self_(cls, query, updated_values: dict) -> dict:
        pk = cls._get_pk()
        for key, value in updated_values.items():
            if key == pk.name:
                continue
            if hasattr(query, key):
                setattr(query, key, parse(value, getattr(cls, key).type)[0])

        result = cls.parse_rows(query)
        db.session.commit()
        return result

    @classmethod
    def _get_pk(cls):
        return inspect(cls).primary_key[0]

    @classmethod
    def pk_get(cls, pk_value: int):
        return db.session.get(cls, pk_value)

    @classmethod
    def exe(cls, query: t.Any):
        return db.session.execute(query).all()

    @classmethod
    def count_by_key(cls, pk_value: int):
        return db.session.execute(
            select(func.count())
            .select_from(cls)
            .where(cls._get_pk() == pk_value)
        ).scalar()

    @classmethod
    def count(cls):
        return db.session.execute(select(func.count(cls._get_pk()))).scalar()

    @classmethod
    def delete_all(cls) -> None:
        db.session.execute(delete(cls))
        db.session.commit()

    @classmethod
    def insert(
        cls, single: dict = None, batch: list = None, debug: bool = False
    ) -> tuple[t.Any, t.Any] | tuple[None, None]:
        if single:
            _ = {
                key: parse(value, getattr(cls, key).type)[0]
                for key, value in single.items()
                if hasattr(cls, key)
            }

            if debug:
                for key, value in _.items():
                    print(f"{key}: {value} - {type(value)}")

            result = db.session.execute(insert(cls).values(**_))
            db.session.commit()

            return result, result.lastrowid

        if batch:
            _ = [
                {
                    key: parse(value, getattr(cls, key).type)[0]
                    for key, value in x.items()
                    if hasattr(cls, key)
                }
                for x in batch
            ]

            if debug:
                for entry in _:
                    if isinstance(entry, dict):
                        for key, value in entry.items():
                            print(f"{key}: {value} - {type(value)}")
                        continue

                    print(entry)

            result = db.session.execute(insert(cls).values(_))
            db.session.commit()

            return result, result.lastrowid

        return None, None

    @classmethod
    def get_by_key(
        cls,
        private_key: int = None,
        foreign_keys: dict = None,
        as_json: bool = False,
        json_include_joins: list[tuple[str, str] | str] = None,
        json_return_key_name: str = None,
        json_remove_return_key: bool = False,
        json_only_columns: list = None,
        paginate: bool = False,
        page: int = 1,
        per_page: int = 10,
        count: bool = True,
    ):
        pk = cls._get_pk()

        _ = select(cls)

        if private_key:
            _ = _.where(pk == private_key)

        if foreign_keys:
            for field, value in foreign_keys.items():
                if hasattr(cls, field):
                    _ = _.where(getattr(cls, field) == value)  # noqa

        if paginate and not as_json:
            return db.paginate(_, page=page, per_page=per_page, count=count)

        if as_json:
            return cls.as_jsonable_dict(
                db.session.execute(_),
                return_key_name=json_return_key_name
                if json_return_key_name
                else cls.__name__,
                remove_return_key=json_remove_return_key,
                one_or_none=True,
                include_joins=json_include_joins,
                only_columns=json_only_columns,
            )

        exe = db.session.execute(_).scalars().all()
        return exe[0] if len(exe) == 1 else exe

    @classmethod
    def update_(cls, record: dict, updated_values: dict):
        pk = cls._get_pk()
        pk_in_values = record.get(pk.name, None)
        _ = {}

        if record:
            for key, value in updated_values.items():
                if key in record:
                    if key == pk.name:
                        continue
                    if hasattr(cls, key):
                        _[key], record[key] = parse(
                            value, getattr(cls, key).type
                        )

            db.session.execute(
                update(cls).where(pk == pk_in_values).values(**_)
            )  # type: ignore
            db.session.commit()

        return record

    @classmethod
    def _as_dict(cls, row: Row) -> dict:
        return {key: row.__dict__[key] for key in row.__dict__ if key[0] != "_"}

    @classmethod
    def parse_rows(
        cls,
        rows: t.Union[Row, list, dict],
        _is_join: bool = False,
        include_joins: list[tuple[str, str] | str] = None,
        join_casts: list[tuple[str, callable]] = None,
        all_columns_but: list = None,
        only_columns: list = None,
    ) -> t.Union[dict, list]:
        if isinstance(rows, list):
            return [cls.parse_rows(row, _is_join=True) for row in rows]

        if include_joins is None:
            include_joins = []

        if all_columns_but is None:
            all_columns_but = []

        if only_columns is None:
            only_columns = []

        def include_column(column_: str) -> bool:
            if only_columns:
                if column_ not in only_columns:
                    return False

            if all_columns_but:
                if column_ in all_columns_but:
                    return False

            return True

        data = dict()
        for column, value in cls._as_dict(rows).items():
            if not _is_join:
                if not include_column(column):
                    continue

            if isinstance(value, collections.InstrumentedList):
                continue

            data[column] = value

        if _is_join:
            return data

        joins = dict()
        if include_joins:
            for join in include_joins:
                if isinstance(join, tuple):
                    name, join_attr = join
                    if hasattr(rows, join_attr):
                        joins[name] = [
                            cls.parse_rows(row, _is_join=True)
                            for row in getattr(rows, join_attr)
                        ] or []

                if isinstance(join, str):
                    if hasattr(rows, join):
                        if isinstance(getattr(rows, join), list):
                            joins[join] = [
                                cls.parse_rows(row, _is_join=True)
                                for row in getattr(rows, join)
                            ] or []

                            continue

                        joins[join] = cls.parse_rows(rows, _is_join=True)

        if join_casts:
            for column, join_cast in join_casts:
                split_join_cast = join_cast.split(".")
                data[column] = getattr(
                    getattr(rows, split_join_cast[0]), split_join_cast[1]
                )

        return {**data, **joins}

    @classmethod
    def as_jsonable_dict(
        cls,
        execute: t.Union[Select, Insert, Update, Delete, Result],
        return_key_name: str = None,
        include_joins: list[tuple[str, str] | str] = None,
        join_casts: list[tuple[str, callable]] = None,
        all_columns_but: list = None,
        only_columns: list = None,
        one_or_none: bool = False,
        remove_return_key: bool = False,
        paginate: bool = False,
        page: int = 1,
        per_page: int = 10,
        count: bool = True,
    ) -> (
        dict
        | dict[str | None, dict]
        | dict[t.Any, t.Any]
        | list[dict]
        | dict[str | None, list[dict]]
    ):
        if (
            isinstance(execute, Select)
            or isinstance(execute, Insert)
            or isinstance(execute, Update)
            or isinstance(execute, Delete)
        ):
            if paginate and not one_or_none:
                execute = db.paginate(
                    execute, page=page, per_page=per_page, count=count
                )
            else:
                execute = db.session.execute(execute)

        parse_args = {
            "include_joins": include_joins,
            "join_casts": join_casts,
            "all_columns_but": all_columns_but,
            "only_columns": only_columns,
        }

        if one_or_none:
            result = execute.scalar_one_or_none()
            if result:
                if remove_return_key:
                    return cls.parse_rows(result, **parse_args)

                return {
                    cls.__name__
                    if return_key_name is None
                    else return_key_name: cls.parse_rows(result, **parse_args)
                }

            return {}

        if remove_return_key:
            r = (
                [cls.parse_rows(x, **parse_args) for x in execute.items]
                if paginate
                else [
                    cls.parse_rows(x, **parse_args)
                    for x in execute.scalars().all()
                ]
            )

            if paginate:
                return {
                    "page": execute.page,
                    "pages": execute.pages,
                    "per_page": execute.per_page,
                    "total": execute.total,
                    "items": r,
                }

            return r

        rk = {
            "__paginate__": {
                "page": execute.page,
                "pages": execute.pages,
                "per_page": execute.per_page,
                "total": execute.total,
            }
            if paginate
            else None,
            cls.__name__ if return_key_name is None else return_key_name: [
                cls.parse_rows(execute.items, **parse_args)
                for x in execute.items
            ]
            if paginate
            else [
                cls.parse_rows(x, **parse_args) for x in execute.scalars().all()
            ],
        }
        return rk
