from settings.base import *

DEBUG = False

INSTALLED_APPS += [
	'django-storages'
]

ALLOWED_HOSTS += [
    'www.xavid.io',
    'xavid.io',
    '13.55.136.6'
]