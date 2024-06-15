import environ

from api.settings import *  # noqa

env = environ.Env(
    SECRET_KEY=(
        str,
        "django-insecure-&#w*b7*0v3z4z62l989)sjk6wqdj_%v-)ty(7iakr+nw9&4i(%",
    ),
)

DEBUG = False
ALLOWED_HOSTS = ["*"]
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = "DENY"
CSRF_TRUSTED_ORIGINS = ["https://document-recognition.wfis.lol"]
DEFAULT_HTTP_PROTOCOL = "https"
USE_X_FORWARDED_HOST = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

SECRET_KEY = env("SECRET_KEY")

STATIC_URL = "/static/"
MEDIA_URL = "/media/"

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "level": "DEBUG",
            "class": "logging.StreamHandler",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "DEBUG",
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": True,
        },
        "django.request": {
            "handlers": ["console"],
            "level": "ERROR",
            "propagate": False,
        },
    },
}

SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
