from flask import current_app as app


@app.cli.command("init-db")
def init_db():
    with app.app_context():
        from app_flask.models import db

        db.create_all()
        print("Database created.")


@app.cli.command("reset-db")
def reset_db():
    with app.app_context():
        from app_flask.models import db

        db.drop_all()
        db.create_all()
        print("Database reset.")
