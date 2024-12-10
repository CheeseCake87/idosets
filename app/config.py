from os import getenv
from secrets import token_hex

from dotenv import load_dotenv
from flask_imp.config import FlaskConfig, ImpConfig, SQLiteDatabaseConfig

from app.services import ZeptoEmailServiceSettings

load_dotenv()

solidjs_routes = (
    ("/login", "solidjs"),
    ("/logout", "solidjs"),
    ("/auth/<account_id>/<auth_code>", "auth"),
    ("/account", "solidjs"),
    ("/account/delete/<account_id>/<auth_code>", "solidjs"),
    ("/workouts", "solidjs"),
    ("/workout/<workout_id>", "solidjs"),
    ("/workout/<workout_id>/logs", "solidjs"),
    ("/workout/<workout_id>/exercise/<exercise_id>", "solidjs"),
    ("/workout/<workout_id>/session/<workout_session_id>", "solidjs"),
)

flask_config = FlaskConfig(
    secret_key=getenv("SECRET_KEY", token_hex(32)),
    permanent_session_lifetime=2678400,
)

flask_config.set_additional(
    vite_url=getenv("VITE_URL"),
    set_host_url=getenv("SET_HOST_URL"),
    run_env=getenv("RUN_ENV"),
    zepto_mail_sender=getenv("ZEPTO_MAIL_SENDER"),
    zepto_mail_api_url=getenv("ZEPTO_MAIL_API_URL"),
    zepto_mail_token=getenv("ZEPTO_MAIL_TOKEN"),
)

imp_config = ImpConfig(
    init_session={
        "logged_in": False,
        "account_id": 0,
        "theme": "dark",
        "units": "kgs",
    },
    database_main=SQLiteDatabaseConfig()
)

zepto_service_settings = ZeptoEmailServiceSettings(
    dev_mode=False,
    sender=getenv("ZEPTO_MAIL_SENDER"),
    api_url=getenv("ZEPTO_MAIL_API_URL"),
    token=getenv("ZEPTO_MAIL_TOKEN"),
)
