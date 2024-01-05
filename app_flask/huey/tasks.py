from . import run


@run.task()
def my_task() -> None:
    print("Hello World!")
    return
