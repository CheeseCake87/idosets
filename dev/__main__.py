import click

from __init__ import Config
from runners import npm_run_dev, flask_run_debug, huey_run, npm_build, supervisor_run, supervisor_end


@click.group()
def main():
    pass


@main.command()
def vite():
    config = Config()
    click.echo("Starting the Vite server in dev...")
    npm_run_dev(config.npm_binary)


@main.command("vite-build")
def vite_build():
    config = Config()
    click.echo("Building the Vite app and copying to Flask...")
    npm_build(
        config.npm_binary,
        config.vite_dir,
        config.flask_static_folder,
        config.flask_templates_folder,
    )


@main.command()
def flask():
    config = Config()
    click.echo("Starting the Flask server in debug...")
    flask_run_debug(config.flask_app)


@main.command()
def huey():
    config = Config()
    click.echo("Starting the Huey consumer...")
    huey_run(config.huey_consumer, config.huey)


@main.command("supervisor-start")
def supervisor_start():
    click.echo("Starting supervisor...")
    supervisor_run()


@main.command("supervisor-stop")
def supervisor_stop():
    click.echo("Stopping supervisor...")
    supervisor_end()


if __name__ == "__main__":
    main()
