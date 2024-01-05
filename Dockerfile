FROM idosets-base-layer:latest
ENV TZ=Europe/London
COPY app_flask app_flask

ENTRYPOINT ["supervisord", "-c", "/traveller-lite/supervisord.conf"]
