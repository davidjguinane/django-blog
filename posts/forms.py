from django import forms

from .models import Post

class PostForm(forms.ModelForm):

	class Meta:
		model = Post
		fields = ('title', 'text',)

class ContactForm(forms.Form):
	name = forms.CharField(widget=forms.TextInput(attrs={
			'class': 'form-control', 
			'type': 'text', 
			'placeholder': 'Name'}), label='')
	email = forms.EmailField(widget=forms.EmailInput(attrs={
			'class': 'form-control', 
			'type': 'email', 
			'placeholder': 'Email'}), label='')
	message = forms.CharField(widget=forms.Textarea(attrs={
			'class': 'form-control', 
			'type': 'text', 
			'placeholder': 'Message'}), label='')