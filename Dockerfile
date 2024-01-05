FROM idosets-base-layer:latest
WORKDIR /main
COPY app_flask app_flask

ENTRYPOINT ["supervisord", "-c", "/main/supervisord.conf"]
