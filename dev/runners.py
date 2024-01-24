import os
import shutil
import signal
import subprocess
from pathlib import Path


def npm_run_dev(npm: str):
    subprocess.run([npm, "run", "dev"], cwd=Path.cwd())


def flask_run_debug(flask_app: str = "app"):
    subprocess.run(["flask", "--app", flask_app, "run", "--debug"])


def gunicorn():
    subprocess.run(["gunicorn"])


def huey_run(huey_consumer_cmd: str, huey_module: str):
    subprocess.run([huey_consumer_cmd, huey_module])


def supervisor_run():
    subprocess.run(["supervisord", "-c", "supervisord.dev.conf"])


def supervisor_end():
    supervisor_pid = Path(Path.cwd() / "supervisord.pid")
    if supervisor_pid.exists():
        with open(supervisor_pid, "r") as f:
            pid = f.read()
            os.kill(int(pid), signal.SIGTERM)
    else:
        print("No supervisord.pid found.")


def npm_build(
    npm: str,
    vite_dir: Path,
    flask_static_folder: Path,
    flask_templates_folder: Path,
):
    assets_folder = flask_static_folder / "assets"
    if assets_folder.exists():
        shutil.rmtree(assets_folder)

    subprocess.run([npm, "run", "build"], cwd=Path.cwd())

    if not vite_dir.exists():
        raise FileNotFoundError(f"{vite_dir} not found.")

    vite_assets_folder = vite_dir / "dist" / "assets"

    if not vite_assets_folder.exists():
        raise FileNotFoundError(f"{vite_assets_folder} not found.")

    if not flask_static_folder.exists():
        raise FileNotFoundError(f"{flask_static_folder} not found.")

    if not flask_templates_folder.exists():
        raise FileNotFoundError(f"{flask_templates_folder} not found.")

    print("Build complete, copying files...")
    subprocess.run(["cp", "-r", vite_assets_folder, flask_static_folder])
    print("Files copied.")
