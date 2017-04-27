from django.shortcuts import render
from django.views import View

# Create your views here.

class WaiveView(View):

	template_name = "waive/waive.html"

	def get(self, request):
		return render(request, self.template_name)