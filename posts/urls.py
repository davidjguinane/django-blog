from django.conf.urls import url
from django.conf import settings
from . import views
from posts.views import PostList, PostDetail, NewPost, PostEdit, HomeView
from django.conf.urls.static import static

app_name = 'posts'
urlpatterns = [
	url(r'^blog/$', PostList.as_view(), name="post_list"),
	url(r'^post/(?P<pk>\d+)/$', PostDetail.as_view(), name="post_detail"),
	url(r'^post/new/$', NewPost.as_view(), name="new_post"),
	url(r'^post/(?P<pk>\d+)/edit/$', PostEdit.as_view(), name='post_edit'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)