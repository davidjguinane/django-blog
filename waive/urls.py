from django.conf.urls import url
from django.conf import settings
from . import views
from waive.views import (
	WaiveView,
	WaiveDataView
	)
from django.conf.urls.static import static

app_name = 'waive'
urlpatterns = [
	url(r'^waive/$', WaiveView.as_view(), name="waive"),
	url(r'^waive/data$', WaiveDataView.as_view(), name="waive-data"),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)