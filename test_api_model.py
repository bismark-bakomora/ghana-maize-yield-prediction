"""Test the ModelService with the new config-based loading."""

from api.services.model_service import ModelService

service = ModelService()

# Test a prediction with sample data
test_input = {
    'District': 'Ashanti',
    'Temperature': 28.5,
    'Humidity': 75,
    'Rainfall': 150,
    'Soil_Moisture': 0.65,
    'Soil_pH': 6.2,
    'Pest_Risk': 0.3,
    'Sunlight': 8.5,
    'Year': 2023,
    'PFJ_Policy': 1,
    'Yield_Lag1': 1.8,
    'Yield_Lag2': 1.7
}

result = service.predict(test_input)
print('✅ Prediction successful!')
print(f"   Predicted yield: {result.get('prediction', 'N/A')}")
print(f"   Model used: {service.model_name}")
print(f"   Full result: {result}")
