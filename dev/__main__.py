import click

from __init__ import Config
from runners import npm_run_dev, flask_run_debug, huey_run, npm_build


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


if __name__ == "__main__":
    main()

# with Pool() as pool:
#     if build:
#         pool.apply_async(npm_build, [config.npm_binary])
#
#     if huey:
#         click.echo("Starting the Huey server...")
#         pool.apply_async(huey_run, [config.huey_consumer_cmd, config.huey_module])
#
#     if vite:
#         click.echo("Starting the Vite server in dev...")
#         pool.apply_async(npm_run_dev, [config.npm_binary])
#
#     if flask:
#         click.echo("Starting the Flask server in debug...")
#         pool.apply_async(flask_run_debug, [config.flask_dir])
#
#     if not vite and not flask and not huey and not build:
#         click.echo("Starting in development mode...")
#         pool.apply_async(huey_run)
#         pool.apply_async(npm_run_dev, [config.npm_binary])
#         pool.apply_async(flask_run_debug)
#
#     pool.close()
#     pool.join()
