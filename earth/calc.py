import requests
import json
from datetime import datetime
import math
import random

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

# Step 1: Make the API request to NASA's NEO API
response = requests.get(NEO_FEED_URL, params=params)
if response.status_code != 200:
    print(f"Failed to retrieve data: {response.status_code}")
    exit()

# Parse the response JSON data
data = response.json()
neos = data['near_earth_objects'][start_date]

# Step 2: Extract relevant NEO data and calculate relative positions
neo_data = []
earth_radius = 6371  # Earth radius in kilometers

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

    # Step 3: Calculate random initial angles and speed for rotation around Earth
    initial_angle = random.uniform(0, 360)  # Random initial angle in degrees
    angular_speed = random.uniform(0.002, 0.01)  # Random angular speed for rotation
    distance_from_earth = miss_distance + earth_radius  # Distance from Earth's center

    # Convert spherical coordinates to Cartesian (x, y, z)
    x = distance_from_earth * math.cos(math.radians(initial_angle))
    y = 0  # All NEOs will start at the equatorial plane (you can modify to add y variation)
    z = distance_from_earth * math.sin(math.radians(initial_angle))

    # Prepare NEO data with initial positions and rotation details
    neo_info = {
        'name': name,
        'magnitude': magnitude,
        'diameter_min_m': estimated_diameter_min,
        'diameter_max_m': estimated_diameter_max,
        'potentially_hazardous': is_potentially_hazardous,
        'relative_velocity_km_per_h': relative_velocity,
        'miss_distance_km': miss_distance,
        'orbiting_body': orbiting_body,
        'initial_angle': initial_angle,  # Angle in degrees
        'angular_speed': angular_speed,  # Speed of orbit rotation
        'distance_from_earth': distance_from_earth,  # Distance in kilometers
        'position': {
            'x': x,
            'y': y,
            'z': z
        }
    }
    neo_data.append(neo_info)

# Step 4: Write data to a JSON file for visualization
output_filename = 'NEO_3D_Data.json'
with open(output_filename, 'w') as json_file:
    json.dump(neo_data, json_file, indent=4)

print(f"NEO 3D data saved to {output_filename}")
