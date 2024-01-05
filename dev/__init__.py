from pathlib import Path
from typing import Optional

import toml


class Config:
    cwd: Path
    pyproject: Path
    config: Optional[dict]
    docker_layers: dict
    npm_binary: str
    vite_dir: Path
    flask_dir: Path
    flask_static_folder: Path
    flask_templates_folder: Path
    huey_consumer: Optional[str]
    huey: Optional[str]

    def __init__(self):
        self.cwd = Path.cwd()
        pyproject = self.cwd / "pyproject.toml"

        if not pyproject.exists():
            raise FileNotFoundError("pyproject.toml not found.")

        self.pyproject = pyproject
        self.config = self._load_config()

        if not self.config:
            raise ValueError("No config found in pyproject.toml")

        self.docker_layers = self.config.get("docker-layers", {})
        self.npm_binary = self.config.get("npm-binary", "npm")
        self.vite_dir = Path(self.cwd / self.config.get("vite-dir", "vite"))
        self.flask_dir = Path(self.cwd / self.config.get("flask-dir", "app"))
        self.flask_static_folder = Path(
            self.config.get("flask-static-folder", self.cwd / "app" / "static")
        )
        self.flask_templates_folder = Path(
            self.config.get(
                "flask-templates-folder", self.cwd / "app" / "templates"
            )
        )
        self.huey_consumer = self.config.get("huey-consumer")
        self.huey = self.config.get("huey")

    def _load_config(self):
        config = toml.load(self.pyproject)
        return config.get("tool", {}).get("dev")

    @property
    def flask_app(self):
        return self.flask_dir.name
