from flask import current_app as app


@app.cli.command("config")
def create_tables():
    print(app.config)
