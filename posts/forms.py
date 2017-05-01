from django import forms

from .models import Post

class PostForm(forms.ModelForm):

	class Meta:
		model = Post
		fields = ('title', 'text',)

class ContactForm(forms.Form):

	contact_name = forms.CharField(widget=forms.TextInput(attrs={
			'class': 'mdl-textfield__input', 
			'id' : 'contact_name',
			'type': 'text'}), label='', required=True)
	contact_email = forms.EmailField(widget=forms.EmailInput(attrs={
			'class': 'mdl-textfield__input',
			'id' : 'contact_email'}), label='', required=True)
	content = forms.CharField(widget=forms.Textarea(attrs={
			'class': 'mdl-textfield__input',
			'id' : 'contact_content'}), label='', required=True)

	class Meta:
		fields = ('contact_name','contact_email','content',)