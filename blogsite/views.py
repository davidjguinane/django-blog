from django.shortcuts import render, get_object_or_404, redirect
from django.views import View
from .models import Post
from .forms import PostForm
import datetime

# Create your views here.

class PostList(View):

	def get(self, request):
		if request.method == 'GET':
			posts = Post.objects.order_by('published_date')
			return render(request, 'blogsite/post_list.html', {'posts': posts})
		else:
			pass

class PostDetail(View):

	def get(self, request, pk):
		if request.method == 'GET':
			post = get_object_or_404(Post, pk=pk)
			return render(request, 'blogsite/post_detail.html', {'post': post})
		else:
			pass

class NewPost(View):

	def get(self, request):
		if request.method == "GET":
			form = PostForm()
			return render(request, 'blogsite/post_edit.html', {'form': form})

	def post(self, request):
		if request.method == "POST":
			form = PostForm(request.POST)
			if form.is_valid():
				post = form.save(commit=False)
				post.author = request.user
				post.published_date = datetime.datetime.now()
				post.save()
				return redirect('post_detail', pk=post.pk)

class PostEdit(View):

	def get(self, request, pk):
		post = get_object_or_404(Post, pk=pk)
		if request.method == "GET":
			form = PostForm(instance=post)
			return render(request, 'blogsite/post_edit.html', {'form': form})

	def post(self, request, pk):
		post = get_object_or_404(Post, pk=pk)
		if request.method == "POST":
			form = PostForm(request.POST, instance=post)
			if form.is_valid():
				post = form.save(commit=False)
				post.author = request.user
				post.published_date = datetime.datetime.now()
				post.save()
				return redirect('post_detail', pk=post.pk)
    
        
    