import requests
import json
from datetime import datetime

# NASA API key and NEO Feed URL
API_KEY = 'DEMO_KEY'  # Replace 'DEMO_KEY' with your own NASA API key
NEO_FEED_URL = 'https://api.nasa.gov/neo/rest/v1/feed'

# Define the date range (current date as start and end)
start_date = datetime.now().strftime('%Y-%m-%d')
end_date = start_date

# Parameters for the API request
params = {
    'start_date': start_date,
    'end_date': end_date,
    'api_key': API_KEY
}

# Step 1: Make the API request
response = requests.get(NEO_FEED_URL, params=params)
if response.status_code != 200:
    print(f"Failed to retrieve data: {response.status_code}")
    exit()

# Parse the response JSON data
data = response.json()
neos = data['near_earth_objects'][start_date]

# Step 2: Extract relevant NEO data and prepare for JSON output
neo_list = []
for neo in neos:
    name = neo['name']
    magnitude = neo['absolute_magnitude_h']
    estimated_diameter_min = neo['estimated_diameter']['meters']['estimated_diameter_min']
    estimated_diameter_max = neo['estimated_diameter']['meters']['estimated_diameter_max']
    is_potentially_hazardous = neo['is_potentially_hazardous_asteroid']
    
    # Get closest approach data
    close_approach_data = neo['close_approach_data'][0]  # Take the first close approach data
    relative_velocity = float(close_approach_data['relative_velocity']['kilometers_per_hour'])
    miss_distance = float(close_approach_data['miss_distance']['kilometers'])
    orbiting_body = close_approach_data['orbiting_body']

    # Prepare data in dictionary format
    neo_info = {
        'name': name,
        'magnitude': magnitude,
        'estimated_diameter': {
            'min': estimated_diameter_min,
            'max': estimated_diameter_max
        },
        'potentially_hazardous': is_potentially_hazardous,
        'relative_velocity_km_per_h': relative_velocity,
        'miss_distance_km': miss_distance,
        'orbiting_body': orbiting_body
    }
    neo_list.append(neo_info)

# Step 3: Write data to a JSON file
output_filename = f"NEO.json"
with open(output_filename, 'w') as json_file:
    json.dump(neo_list, json_file, indent=4)

print(f"NEO data saved to {output_filename}")
