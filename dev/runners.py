import subprocess
from pathlib import Path


def npm_run_dev(npm: Path):
    pro_ = subprocess.Popen([npm, "run", "dev"], cwd=Path.cwd())
    pro_.wait()


def flask_run_debug(flask_app: str = "app"):
    pro_ = subprocess.Popen(["flask", "--app", flask_app, "run", "--debug"])
    pro_.wait()


def gunicorn():
    pro_ = subprocess.Popen(["gunicorn"])
    pro_.wait()


def huey_run(huey_consumer_cmd: str, huey_module: str):
    pro_ = subprocess.Popen([huey_consumer_cmd, huey_module])
    pro_.wait()


def npm_build(cwd, config, npm: Path):
    vite_index_file = Path(cwd / config["vite_index_file"])
    vite_assets_folder = Path(cwd / config["vite_assets_folder"])
    flask_static_folder = Path(cwd / config["flask_static_folder"])
    flask_templates_folder = Path(cwd / config["flask_templates_folder"])

    pro_ = subprocess.Popen([npm, "run", "build"], cwd=Path.cwd())
    pro_.wait()
    print("Build complete, copying files...")
    subprocess.run(["cp", "-r", vite_assets_folder, flask_static_folder])
    subprocess.run(["cp", vite_index_file, flask_templates_folder])
    print("Files copied.")
