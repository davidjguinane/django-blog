from django.shortcuts import render
from django.views import View
import requests
import json 
import datetime as dt
from django.shortcuts import render_to_response
from django.http import HttpResponse
# Create your views here.

class WaiveView(View):

	template_name = "waive/waive.html"

	def get(self, request):
		return render(request, self.template_name)

class WaiveDataView(View):

	def get(self, request):
		if request.is_ajax():
			# Send a GET request to Data API
			response = requests.get("https://data.qld.gov.au/api/action/datastore_search?resource_id=2bbef99e-9974-49b9-a316-57402b00609c&q=emu&limit=5000")
			# Load the data as JSON
			data = response.json()
			# Returns the Wave Data Records in a List
			wave_data = data['result']['records']
			#print(wave_data)
			# The actual data needed is in a Dictionary inside the Records (wave_data) List
			# Get the last record
			i = -2
			for entry in wave_data:
				i += 1
			#print(i)
			# Convert the Data into a more readable format
			date = wave_data[i]['DateTime']
			#print(date)
			dateobject = dt.datetime.strptime(date, '%Y-%m-%dT%H:%M:%S')
			#print(dateobject)
			fdate = dateobject.strftime('%A %d %b %Y %I:%M%p')
			#print(fdate)
			Hs = wave_data[i]['Hsig'] # Significant wave height, an average of the highest third of the waves in a record (26.6 minute recording period).
			#print(Hs)
			Hmax = wave_data[i]['Hmax'] # The maximum wave height in the record.
			Tz = wave_data[i]['Tz'] # The zero upcrossing wave period.
			Tp = wave_data[i]['Tp'] # The peak energy wave period.
			Dir_Tp_TRUE = wave_data[i]['Direction'] # Direction (related to true north) from which the peak period waves are coming from.
			SST = wave_data[i]['SST'] # Approximation of sea surface temperature.
			data = {'fdate': fdate,'Hs': Hs,'Hmax': Hmax, 'Tz': Tz, 'Tp': Tp, 'Dir_Tp_TRUE': Dir_Tp_TRUE, 'SST': SST}
			return HttpResponse(json.dumps(data))