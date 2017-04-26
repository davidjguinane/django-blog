from django.shortcuts import render, get_object_or_404, redirect
from django.views import View
from .models import Post
from .forms import PostForm, ContactForm
import datetime
from django.views.generic import *

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

class HomeView(FormView):

	template_name = "posts/home.html"

	def get_success_url(self):
		return reverse('success')

	def get(self, request):
		return render(request, self.template_name)

	@staticmethod
	def validate_email_address(email):
	
	#This method here validates the if the input is an email address or not. 
	#Its return type is boolean, True if the input is a email address or False if its not.
		try:
			validate_email(email)
			return True
		except ValidationError:
			return False

	'''def post(self, request, *args, **kwargs):
	
	# A normal post request which takes input from field "email"
	
		form = self.form_class(request.POST)
		if form.is_valid():
			name = form.cleaned_data["name"]
			email = form.cleaned_data["email"]
			message = form.cleaned_data["message"]
			if self.validate_email_address(data) is True:
				c = {
					'email': 'david.j.guinane@gmail.com',
					'domain': request.META['HTTP_HOST'],
					'site_name': 'Davids blog',
					'protocol': 'http',
					}
					subject_template_name='posts/contact-form-subject.txt' 
					email_template_name='posts/contact-form.html'    
					subject = loader.render_to_string(subject_template_name, c)
					# Email subject *must not* contain newlines
					subject = ''.join(subject.splitlines())
					email = loader.render_to_string(email_template_name, c)
					send_mail(subject, email, DEFAULT_FROM_EMAIL , , fail_silently=False)
				result = self.form_valid(form)
				return result
			else:
				result = self.form_invalid(form)
				return result
'''

class PostList(View):

	def get(self, request):
		if request.method == 'GET':
			blog = Post.objects.order_by('published_date')
			paginator = Paginator(blog, 5)
			page = request.GET.get('page')
			try:
				posts = paginator.page(page)
			except PageNotAnInteger:
				posts = paginator.page(1)
			except EmptyPage:
				posts = paginator.page(paginator.num_pages)
			return render(request, 'posts/post_list.html', {'posts': posts})

class PostDetail(View):

	def get(self, request, pk):
		if request.method == 'GET':
			post = get_object_or_404(Post, pk=pk)
			blogs = Post.objects.order_by('published_date')
			context = {'post': post, 'blogs' : blogs }
			return render(request, 'posts/post_detail.html', context)
		else:
			pass

class NewPost(View):

	def get(self, request):
		if request.method == "GET":
			form = PostForm()
			return render(request, 'posts/post_edit.html', {'form': form})

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
			return render(request, 'posts/post_edit.html', {'form': form})

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
    


	


	

	def post(self, request, *args, **kwargs):
	
	# A normal post request which takes input from field "email_or_username" (in ResetPasswordRequestForm). 
	
		form = self.form_class(request.POST)
		if form.is_valid():
			data= form.cleaned_data["email_or_username"]
		if self.validate_email_address(data) is True:                 #uses the method written above
			
			# If the input is an valid email address, then the following code will lookup for users associated with that email address. 
			# If found then an email will be sent to the address, else an error message will be printed on the screen.
			
			associated_users = User.objects.filter(Q(email=data)|Q(username=data))
			if associated_users.exists():
				for user in associated_users:
						c = {
							'email': user.email,
							'domain': request.META['HTTP_HOST'],
							'site_name': 'Umanity',
							'uid': urlsafe_base64_encode(force_bytes(user.pk)),
							'user': user,
							'token': default_token_generator.make_token(user),
							'protocol': 'http',
							}
						subject_template_name='login/password-reset-subject.txt' 
						email_template_name='login/password-reset-email.html'    
						subject = loader.render_to_string(subject_template_name, c)
						# Email subject *must not* contain newlines
						subject = ''.join(subject.splitlines())
						email = loader.render_to_string(email_template_name, c)
						send_mail(subject, email, DEFAULT_FROM_EMAIL , [user.email], fail_silently=False)
				result = self.form_valid(form)
				return result
			else:
				result = self.form_invalid(form)
				return result
		else:
			
			# If the input is an username, then the following code will lookup for users associated with that user. 
			# If found then an email will be sent to the user's address, else an error message will be printed on the screen.
			
			associated_users= User.objects.filter(username=data)
			if associated_users.exists():
				for user in associated_users:
					c = {
						'email': user.email,
						'domain': 'example.com', #or your domain
						'site_name': 'example',
						'uid': urlsafe_base64_encode(force_bytes(user.pk)),
						'user': user,
						'token': default_token_generator.make_token(user),
						'protocol': 'http',
						}
					subject_template_name='login/password-reset-subject.txt' 
					email_template_name='login/password-reset-email.html'
					subject = loader.render_to_string(subject_template_name, c)
					# Email subject *must not* contain newlines
					subject = ''.join(subject.splitlines())
					email = loader.render_to_string(email_template_name, c)
					send_mail(subject, email, DEFAULT_FROM_EMAIL , [user.email], fail_silently=False)
				result = self.form_valid(form)
				return result
			else:
				result = self.form_invalid(form)
				return result
		return self.form_invalid(form)