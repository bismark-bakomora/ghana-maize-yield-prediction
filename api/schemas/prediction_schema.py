"""
Pydantic Schemas for Prediction Endpoints
Defines request and response models for the prediction API endpoints.
"""

from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime
from enum import Enum


class SoilType(str, Enum):
    """Enumeration of valid soil types."""
    FOREST_OCHROSOL = "Forest Ochrosol"
    COASTAL_SAVANNAH = "Coastal Savannah"
    TROPICAL_BLACK_EARTH = "Tropical Black Earth"
    SAVANNA_OCHROSOL = "Savanna Ochrosol"


class PredictionRequest(BaseModel):
    """Schema for single prediction request."""
    
    district: str = Field(
        ...,
        description="Name of the district in Ghana",
        example="Kumasi"
    )
    
    year: int = Field(
        ...,
        ge=2011,
        le=2030,
        description="Year for prediction",
        example=2024
    )
    
    rainfall: float = Field(
        ...,
        ge=0,
        le=2000,
        description="Annual rainfall in millimeters",
        example=750.5
    )
    
    temperature: float = Field(
        ...,
        ge=15,
        le=40,
        description="Average temperature in Celsius",
        example=26.5
    )
    
    humidity: float = Field(
        ...,
        ge=0,
        le=100,
        description="Average relative humidity in percentage",
        example=75.0
    )
    
    sunlight: float = Field(
        ...,
        ge=0,
        le=24,
        description="Average daily sunlight hours",
        example=6.5
    )
    
    soil_moisture: float = Field(
        ...,
        ge=0,
        le=1,
        description="Soil moisture content (0-1 scale)",
        example=0.65
    )
    
    soil_type: Optional[SoilType] = Field(
        None,
        description="Type of soil in the district"
    )
    
    pest_risk: int = Field(
        ...,
        ge=0,
        le=1,
        description="Pest risk indicator (0=No, 1=Yes)",
        example=0
    )
    
    pfj_policy: int = Field(
        ...,
        ge=0,
        le=1,
        description="PFJ Policy active (0=No, 1=Yes)",
        example=1
    )
    
    yield_lag1: Optional[float] = Field(
        None,
        ge=0,
        description="Previous year's yield in tons/ha",
        example=2.3
    )
    
    class Config:
        schema_extra = {
            "example": {
                "district": "Kumasi",
                "year": 2024,
                "rainfall": 750.5,
                "temperature": 26.5,
                "humidity": 75.0,
                "sunlight": 6.5,
                "soil_moisture": 0.65,
                "soil_type": "Forest Ochrosol",
                "pest_risk": 0,
                "pfj_policy": 1,
                "yield_lag1": 2.3
            }
        }
    
    @validator('yield_lag1', always=True)
    def set_default_yield_lag(cls, v, values):
        """Set default yield_lag1 if not provided."""
        if v is None:
            return 2.0  # Default average yield
        return v


class PredictionResponse(BaseModel):
    """Schema for single prediction response."""
    
    prediction: float = Field(
        ...,
        description="Predicted maize yield in tons per hectare"
    )
    
    confidence_interval: Optional[dict] = Field(
        None,
        description="95% confidence interval for prediction"
    )
    
    risk_factors: Optional[List[str]] = Field(
        None,
        description="Identified risk factors affecting yield"
    )
    
    recommendations: Optional[List[str]] = Field(
        None,
        description="Recommendations for improving yield"
    )
    
    model_version: str = Field(
        ...,
        description="Version of the model used for prediction"
    )
    
    timestamp: datetime = Field(
        default_factory=datetime.now,
        description="Timestamp of prediction"
    )
    
    class Config:
        schema_extra = {
            "example": {
                "prediction": 2.45,
                "confidence_interval": {
                    "lower": 2.20,
                    "upper": 2.70
                },
                "risk_factors": [
                    "Below optimal rainfall",
                    "Elevated pest risk"
                ],
                "recommendations": [
                    "Consider supplementary irrigation",
                    "Implement pest control measures"
                ],
                "model_version": "xgboost_v1.0",
                "timestamp": "2024-12-20T10:30:00"
            }
        }


class BatchPredictionRequest(BaseModel):
    """Schema for batch prediction request."""
    
    predictions: List[PredictionRequest] = Field(
        ...,
        description="List of prediction requests"
    )
    
    class Config:
        schema_extra = {
            "example": {
                "predictions": [
                    {
                        "district": "Kumasi",
                        "year": 2024,
                        "rainfall": 750.5,
                        "temperature": 26.5,
                        "humidity": 75.0,
                        "sunlight": 6.5,
                        "soil_moisture": 0.65,
                        "soil_type": "Forest Ochrosol",
                        "pest_risk": 0,
                        "pfj_policy": 1,
                        "yield_lag1": 2.3
                    },
                    {
                        "district": "Tamale",
                        "year": 2024,
                        "rainfall": 650.0,
                        "temperature": 28.0,
                        "humidity": 65.0,
                        "sunlight": 7.2,
                        "soil_moisture": 0.55,
                        "soil_type": "Savanna Ochrosol",
                        "pest_risk": 1,
                        "pfj_policy": 1,
                        "yield_lag1": 1.8
                    }
                ]
            }
        }


class BatchPredictionResponse(BaseModel):
    """Schema for batch prediction response."""
    
    predictions: List[PredictionResponse] = Field(
        ...,
        description="List of predictions"
    )
    
    total_predictions: int = Field(
        ...,
        description="Total number of predictions made"
    )
    
    processing_time_seconds: float = Field(
        ...,
        description="Time taken to process batch"
    )
    
    timestamp: datetime = Field(
        default_factory=datetime.now,
        description="Timestamp of batch prediction"
    )


class FeatureImportanceResponse(BaseModel):
    """Schema for feature importance response."""
    
    features: List[dict] = Field(
        ...,
        description="List of features with importance scores"
    )
    
    model_name: str = Field(
        ...,
        description="Name of the model"
    )
    
    class Config:
        schema_extra = {
            "example": {
                "features": [
                    {"feature": "Yield_Lag1", "importance": 0.25},
                    {"feature": "Rainfall", "importance": 0.18},
                    {"feature": "Temperature", "importance": 0.15}
                ],
                "model_name": "xgboost"
            }
        }


class ModelInfoResponse(BaseModel):
    """Schema for model information response."""
    
    model_name: str = Field(..., description="Name of the model")
    model_version: str = Field(..., description="Version of the model")
    model_type: str = Field(..., description="Type of ML algorithm")
    training_date: str = Field(..., description="Date model was trained")
    performance_metrics: dict = Field(..., description="Model performance metrics")
    features_count: int = Field(..., description="Number of features used")
    
    class Config:
        schema_extra = {
            "example": {
                "model_name": "xgboost",
                "model_version": "1.0.0",
                "model_type": "XGBRegressor",
                "training_date": "2024-12-20",
                "performance_metrics": {
                    "r2": 0.87,
                    "rmse": 0.25,
                    "mae": 0.19
                },
                "features_count": 16
            }
        }