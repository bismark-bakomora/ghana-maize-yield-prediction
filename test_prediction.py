import requests

url = "http://127.0.0.1:8000/api/v1/predict"
data = {
    "Rainfall": 120,
    "Temperature": 28,
    "Humidity": 75,
    "Sunlight": 8,
    "Soil_Moisture": 0.35,
    "Pest_Risk": 2,
    "PFJ_Policy": 1,
    "Yield_Lag1": 2.5,
    "Growing_Degree_Days": 224,
    "Water_Availability": 42,
    "Climate_Stress": 0.37,
    "Moisture_Temp_Ratio": 0.0125,
    "Rainfall_per_Sun": 15,
    "Years_Since_PFJ": 8,
    "Yield_Change": 0.5,
    "Yield_Growth_Rate": 0.2
}

response = requests.post(url, json=data)
print(response.json())
