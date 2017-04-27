from django.conf.urls import url
from django.conf import settings
from . import views
from waive.views import WaiveView

app_name = 'waive'
urlpatterns = [
	url(r'^waive/$', WaiveView.as_view(), name="waive"),
]