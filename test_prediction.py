import requests

url = "http://127.0.0.1:8000/api/v1/predict"

data = {
    "district": "Tamale",
    "year": 2024,
    "rainfall": 120,
    "temperature": 28,
    "humidity": 75,
    "sunlight": 8,
    "soil_moisture": 0.35,
    "pest_risk": 1,
    "pfj_policy": 1,
    "yield_lag1": 2.5,
    "growing_degree_days": 224,
    "water_availability": 42,
    "climate_stress": 0.37,
    "moisture_temp_ratio": 0.0125,
    "rainfall_per_sun": 15,
    "years_since_pfj": 8,
    "yield_change": 0.5,
    "yield_growth_rate": 0.2
}

response = requests.post(url, json=data)
print(response.status_code)
print(response.json())
