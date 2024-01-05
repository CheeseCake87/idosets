from os import environ

bind = "0.0.0.0:5000"
workers = 1
wsgi_app = "app_flask:create_app()"
worker_class = "eventlet"

if environ.get("FLASK_ENV") == "development":
    reload = True
    capture_output = True
