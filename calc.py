from skyfield.api import load, Topos
import json

# Load the ephemeris data from NASA's DE421 file
planets = load('de421.bsp')

# Define the celestial objects
bodies = {
    "Sun": planets['sun'],
    "Mercury": planets['mercury'],
    "Venus": planets['venus'],
    "Earth": planets['earth'],
    "Moon": planets['moon'],  # Earth's moon
    "Mars": planets['mars'],
    "Jupiter": planets['jupiter barycenter'],  # Jupiter system barycenter
    "Saturn": planets['saturn barycenter'],    # Saturn system barycenter
    "Uranus": planets['uranus barycenter'],    # Uranus system barycenter
    "Neptune": planets['neptune barycenter'],  # Neptune system barycenter
    "Pluto": planets['pluto barycenter']       # Pluto system barycenter
}

# Choose a specific date/time for the calculations
ts = load.timescale()
t = ts.utc(2024, 10, 5)  # Example date: October 5, 2024

# Calculate the positions of each body relative to the Sun
orbital_data = {}
for body_name, body in bodies.items():
    if body_name == "Sun":
        # The Sun is at the origin (0, 0, 0) in the heliocentric coordinate system
        x, y, z = 0.0, 0.0, 0.0
    else:
        # Calculate position relative to the Sun
        position = body.at(t).observe(planets['sun']).apparent()
        x, y, z = position.position.au  # Astronomical Units (AU)

    # Store the positions in the dictionary
    orbital_data[body_name] = {"x": x, "y": y, "z": z}

# Save the orbital data to a JSON file for visualization
with open('solar_system_positions.json', 'w') as json_file:
    json.dump(orbital_data, json_file, indent=4)

print("Orbital data saved to 'solar_system_positions.json'")
