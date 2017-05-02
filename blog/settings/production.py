from blog.settings.base import *

DEBUG = False

DEFAULT_FILE_STORAGE = 'aws_storage_classes.MediaStorage'
STATICFILES_STORAGE = 'aws_storage_classes.StaticStorage'
AWS_ACCESS_KEY_ID = 'AKIAJM6WYOVTZISQKMHQ'
SECRET_ACCESS_KEY_ID = 'lDmfhrV0ep3rlUhZ6JVALuuf7f+j3K2LlzD4cWws'
AWS_STORAGE_BUCKET_NAME = 'xavid.io'


INSTALLED_APPS += [
	'storages'
]

ALLOWED_HOSTS += [
    'www.xavid.io',
    'xavid.io',
    '13.55.136.6'
]

# S3 Bucket URL: <bucket-name>.s3.amazonaws.com
#STATIC_URL: <bucket-name>.s3.amazonaws.com/static/
#MEDIA_URL: <bucket-name>.s3.amazonaws.com/media/

#AWS_S3_DOMAIN = '{0}.s3.amazonaws.com'.format(AWS_STORAGE_BUCKET_NAME)

#STATIC_URL = 'https://{0}/static/'.format(AWS_S3_DOMAIN)
#MEDIA_URL = 'https://{0}/media/'.format(AWS_S3_DOMAIN)

STATIC_URL = 'https://xavid.io.s3.amazonaws.com/static/'
MEDIA_URL = 'https://xavid.io.s3.amazonaws.com/media/'

STATIC_ROOT = '/var/www/django-blog/static/'
MEDIA_ROOT = '/var/www/django-blog/media/'