import json
import math
from datetime import datetime

# Define the properties of Saturn, its rings, and its major moons (scaled down)
saturn_system = {
    "saturn": {
        "radius": 6,  # Smaller radius for better scale in the visualization
        "rotation_speed": 0.02  # Speed of rotation in radians per frame (for visualization)
    },
    "rings": [
        {
            "name": "Inner Ring",
            "inner_radius": 9,  # Scaled down ring size
            "outer_radius": 13,
        },
        {
            "name": "Outer Ring",
            "inner_radius": 13,
            "outer_radius": 20
        }
    ],
    "moons": [
        {"name": "Titan", "distance_from_saturn": 40, "radius": 1.5, "rotation_speed": 0.005},  # Titan's data
        {"name": "Rhea", "distance_from_saturn": 25, "radius": 0.8, "rotation_speed": 0.008},
        {"name": "Iapetus", "distance_from_saturn": 55, "radius": 0.7, "rotation_speed": 0.0025},
        {"name": "Dione", "distance_from_saturn": 22, "radius": 0.7, "rotation_speed": 0.01},
        {"name": "Tethys", "distance_from_saturn": 18, "radius": 0.7, "rotation_speed": 0.012},
        {"name": "Enceladus", "distance_from_saturn": 14, "radius": 0.4, "rotation_speed": 0.015},
        {"name": "Mimas", "distance_from_saturn": 10, "radius": 0.3, "rotation_speed": 0.02}
    ]
}

# Calculate positions of moons and rings
for moon in saturn_system["moons"]:
    moon["initial_angle"] = math.radians(360 * (datetime.now().second / 60))  # Set a random initial angle for each moon

# Save the Saturn system data to a JSON file
with open("saturn_system.json", "w") as json_file:
    json.dump(saturn_system, json_file, indent=4)

print("Saturn system data has been saved to 'saturn_system.json'")
