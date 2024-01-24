import dotenv

dotenv.load_dotenv()

workers = 3
bind = "0.0.0.0:5000"
wsgi_app = "app_flask:create_app()"
