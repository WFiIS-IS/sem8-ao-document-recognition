FROM python:3.12.2-slim-bookworm AS python_base

ENV DEBIAN_FRONTEND=noninteractive
RUN apt update && apt install -y --no-install-recommends \
    build-essential gdb lcov pkg-config cmake \
    libbz2-dev libffi-dev libgdbm-dev libgdbm-compat-dev liblzma-dev \
    libncurses5-dev libreadline6-dev libsqlite3-dev libssl-dev \
    lzma lzma-dev tk-dev uuid-dev zlib1g-dev libpq-dev
COPY requirements.txt /requirements.txt
RUN pip install --no-cache-dir -r /requirements.txt
RUN rm /requirements.txt

FROM python_base AS builder
ENV DJANGO_SETTINGS_MODULE=api.settings_prod
ENV DEBUG 0
WORKDIR /app
COPY . /app
RUN mkdir -p /app/build/static /app/build/media
RUN ["./manage.py", "collectstatic", "--noinput"]

FROM nginx:1.26 AS static-server
ENV DEBUG 0
COPY --from=builder --chown=nginx:nginx /app/build/static /usr/share/nginx/static
COPY --from=builder --chown=nginx:nginx /app/build/media /usr/share/nginx/media
COPY ./docker/static.nginx.conf /etc/nginx/conf.d/default.conf

FROM python_base AS application-server
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV DEBUG 0
ENV DJANGO_SETTINGS_MODULE=api.settings_prod
RUN addgroup --system --gid 1001 document-recognition
RUN adduser --system --uid 1001 document-recognition
USER document-recognition
WORKDIR /home/document-recognition/app
VOLUME ./media
COPY --from=builder --chown=document-recognition:document-recognition /app .
CMD ["gunicorn", "--workers=4", "-b 0.0.0.0:8000", "--capture-output", "--log-level=info", "--access-logfile=-", "--error-logfile=-", "api.wsgi"]
