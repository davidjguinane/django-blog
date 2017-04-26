from django.db import models
import datetime

# Create your models here.

class Post(models.Model):
	author = models.ForeignKey('auth.User')
	title = models.CharField(max_length=200) 
	published_date = models.DateTimeField(null=True)
	summary = models.TextField(blank=True)
	text = models.TextField(blank=True)

	def publish_post(self):
		self.published_date = datetime.datetime.now()
		self.save()

	def __str__(self):
		return self.title
