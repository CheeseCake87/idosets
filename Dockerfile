FROM python:alpine
ENV TZ=Europe/London
RUN apk add --update --no-cache linux-headers tzdata
WORKDIR /main
COPY requirements.txt requirements.txt
RUN python -m pip install --upgrade pip
RUN pip install -r requirements.txt
COPY app app_flask
COPY configs/gunicorn.conf.py gunicorn.conf.py
COPY supervisord.conf supervisord.conf
COPY supervisor.ini supervisor.ini
COPY .env .env
RUN mkdir -p /app_flask/instance
RUN flask --app app_flask init-db

ENTRYPOINT ["supervisord", "-c", "supervisord.conf"]
