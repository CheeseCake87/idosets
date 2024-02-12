import json
from pathlib import Path

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


@app.cli.command("backup-db")
def backup_db():
    with app.app_context():
        from app_flask.models.accounts import Accounts
        from app_flask.models.workouts import Workouts
        from app_flask.models.exercises import Exercises

        backup = {}

        all_accounts = Accounts.get_all_accounts()
        if not all_accounts:
            print("No accounts to backup.")
            return

        for account in all_accounts:
            backup[account.email_address] = {
                "settings": account.settings,
                "__workouts__": [],
            }
            workouts = Workouts.get_by_account_id(account.account_id)

            if not workouts:
                continue

            for workout in workouts:
                store = {
                    "name": workout.name,
                    "__exercises__": [],
                }

                exercises = Exercises.get_by_workout_id(workout.workout_id)

                if not exercises:
                    continue

                for exercise in exercises:
                    store["__exercises__"].append({
                        "order": exercise.order,
                        "name": exercise.name,
                        "info_url": exercise.info_url,
                        "info_url_favicon": exercise.info_url_favicon,
                    })

                backup[account.email_address]["__workouts__"].append(store)

        instance_dir = Path(app.root_path) / "instance"
        backup_file = instance_dir / "backup.json"

        if not instance_dir.exists():
            print("Instance directory does not exist.")
            print(instance_dir)
            return

        if not backup_file.exists():
            backup_file.touch()

        backup_file.write_text(json.dumps(backup), encoding="utf-8")

        print("Backup complete.")


@app.cli.command("restore-db")
def restore_db():
    with app.app_context():
        from app_flask.models.accounts import Accounts
        from app_flask.models.workouts import Workouts
        from app_flask.models.exercises import Exercises

        instance_dir = Path(app.root_path) / "instance"
        backup_file = instance_dir / "backup.json"

        backup = json.loads(backup_file.read_text(encoding="utf-8"))

        for account, data in backup.items():
            Accounts.insert(
                single={
                    "email_address": account,
                    "settings": data["settings"],
                }
            )
            print(account)
            print(data)
            print()
