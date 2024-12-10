FROM app-idosets-base:latest
WORKDIR /main

COPY configs/gunicorn.conf.py gunicorn.conf.py
COPY app app
COPY .env .env

RUN mkdir -p instance
RUN flask --app app init-db

ENTRYPOINT ["gunicorn", "-c", "gunicorn.conf.py"]
