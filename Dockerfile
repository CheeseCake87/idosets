FROM idosets-base:latest
WORKDIR /main
COPY app_flask app_flask
COPY gunicorn.conf.py gunicorn.conf.py
COPY supervisord.conf supervisord.conf
COPY supervisor.ini supervisor.ini
RUN mkdir -p /app_flask/instance

ENTRYPOINT ["supervisord", "-c", "supervisord.conf"]
