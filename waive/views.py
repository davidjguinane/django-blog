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
			wResponse = requests.get('http://www.bom.gov.au/fwo/IDQ60801/IDQ60801.94373.json')
			# Load the data as JSON
			data = response.json()
			wData = wResponse.json()
			# Returns the Wave Data Records in a List
			wave_data = data['result']['records']
			wind_data = wData['observations']['data']
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
			# Convert the Date to the Wind Date Format
			wdate= dateobject.strftime('%Y%m%d%H%M%S')
			# Convert the Date to the Tide Date Format
			tdate= dateobject.strftime('%d%m%Y%H%M')			
			#print(fdate)
			Hs = wave_data[i]['Hsig'] # Significant wave height, an average of the highest third of the waves in a record (26.6 minute recording period).
			#print(Hs)
			Hmax = wave_data[i]['Hmax'] # The maximum wave height in the record.
			Tz = wave_data[i]['Tz'] # The zero upcrossing wave period.
			Tp = wave_data[i]['Tp'] # The peak energy wave period.
			Dir_Tp_TRUE = wave_data[i]['Direction'] # Direction (related to true north) from which the peak period waves are coming from.
			SST = wave_data[i]['SST'] # Approximation of sea surface temperature.
			w = -1
			for entry in wind_data:
				w += 1
				#print(i)
				# Convert the Data into a more readable format
				wind_date = wind_data[w]['local_date_time_full']
				if wind_date == wdate:
					print('working')
					wind_dir = wind_data[w]['wind_dir']
					onshore = ['E','NE', 'NNE', 'ENE', 'ESE', 'SE']
					offshore = ['W','WSW','SW', 'SSW','WNW','NW','NNW']
					if wind_dir in onshore:
						wind_type = 'Onshore'
					elif wind_dir in offshore:
						wind_type = 'Offshore'
					else:
						wind_type = 'Perpendicular'
					wind_spd_kmh = wind_data[w]['wind_spd_kmh']
			data = {'fdate': fdate,'Hs': Hs,'Hmax': Hmax, 'Tz': Tz, 'Tp': Tp, 'Dir_Tp_TRUE': Dir_Tp_TRUE, 'SST': SST, 'wind_dir':wind_dir, 'wind_type':wind_type, 'wind_spd_kmh':wind_spd_kmh}
			return HttpResponse(json.dumps(data))