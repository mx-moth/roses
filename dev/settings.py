from dj_database_url import parse

from roses.settings import *  # noqa

SECRET_KEY = 'super secret shhhhh'
DEBUG = True

ALLOWED_HOSTS = ['roses.vcap.me', '*', 'localhost']
INTERNAL_IPS = ['127.0.0.1', '172.19.0.1']

DATABASES = {
    'default': parse('postgres://postgres@database/postgres'),
}

DATA_ROOT = '/app/data/'
MEDIA_ROOT = DATA_ROOT + 'media/'

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'mail'
EMAIL_PORT = 25
