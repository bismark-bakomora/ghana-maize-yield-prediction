"""
Prediction API Routes

Defines endpoints for making yield predictions.
"""

from fastapi import APIRouter, HTTPException, Depends, Request
from typing import List
import time
import logging

from api.schemas.prediction_schema import (
    PredictionRequest,
    PredictionResponse,
    BatchPredictionRequest,
    BatchPredictionResponse,
    FeatureImportanceResponse,
    ModelInfoResponse
)
from api.services.model_service import ModelService

logger = logging.getLogger(__name__)

router = APIRouter()


def get_model_service(request: Request) -> ModelService:
    """Dependency to get model service from app state."""
    return request.app.state.model_service


@router.post("/predict", response_model=PredictionResponse)
async def predict_yield(
    request: PredictionRequest,
    model_service: ModelService = Depends(get_model_service)
):
    """
    Make a single yield prediction.
    
    **Parameters:**
    - district: Name of the district
    - year: Year for prediction
    - rainfall: Annual rainfall in mm
    - temperature: Average temperature in °C
    - humidity: Average relative humidity in %
    - sunlight: Average daily sunlight hours
    - soil_moisture: Soil moisture content (0-1)
    - soil_type: Type of soil (optional)
    - pest_risk: Pest risk indicator (0 or 1)
    - pfj_policy: PFJ Policy status (0 or 1)
    - yield_lag1: Previous year's yield (optional)
    
    **Returns:**
    - Predicted yield in tons/ha
    - Confidence interval
    - Risk factors
    - Recommendations
    """
    try:
        logger.info(f"Received prediction request for {request.district}, {request.year}")
        
        # Convert request to dictionary
        input_data = request.dict()
        
        # Make prediction
        result = model_service.predict(input_data)
        
        # Create response
        response = PredictionResponse(
            prediction=result['prediction'],
            confidence_interval=result['confidence_interval'],
            risk_factors=result['risk_factors'],
            recommendations=result['recommendations'],
            model_version=result['model_version']
        )
        
        logger.info(f"Prediction successful: {result['prediction']:.2f} tons/ha")
        return response
        
    except Exception as e:
        logger.error(f"Prediction failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )


@router.post("/predict/batch", response_model=BatchPredictionResponse)
async def predict_batch(
    request: BatchPredictionRequest,
    model_service: ModelService = Depends(get_model_service)
):
    """
    Make batch yield predictions.
    
    **Parameters:**
    - predictions: List of prediction requests
    
    **Returns:**
    - List of predictions with metadata
    - Total predictions count
    - Processing time
    """
    try:
        start_time = time.time()
        
        logger.info(f"Received batch prediction request with {len(request.predictions)} items")
        
        # Convert requests to dictionaries
        input_data_list = [pred.dict() for pred in request.predictions]
        
        # Make batch predictions
        results = model_service.predict_batch(input_data_list)
        
        # Create response objects
        prediction_responses = []
        for result in results:
            pred_response = PredictionResponse(
                prediction=result['prediction'],
                confidence_interval=result['confidence_interval'],
                risk_factors=result['risk_factors'],
                recommendations=result['recommendations'],
                model_version=result['model_version']
            )
            prediction_responses.append(pred_response)
        
        processing_time = time.time() - start_time
        
        response = BatchPredictionResponse(
            predictions=prediction_responses,
            total_predictions=len(prediction_responses),
            processing_time_seconds=processing_time
        )
        
        logger.info(f"Batch prediction successful: {len(prediction_responses)} predictions in {processing_time:.2f}s")
        return response
        
    except Exception as e:
        logger.error(f"Batch prediction failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Batch prediction failed: {str(e)}"
        )


@router.get("/model/features", response_model=FeatureImportanceResponse)
async def get_feature_importance(
    top_n: int = 15,
    model_service: ModelService = Depends(get_model_service)
):
    """
    Get feature importance from the trained model.
    
    **Parameters:**
    - top_n: Number of top features to return (default: 15)
    
    **Returns:**
    - List of features with importance scores
    - Model name
    """
    try:
        logger.info(f"Fetching top {top_n} feature importances")
        
        features = model_service.get_feature_importance(top_n=top_n)
        
        if not features:
            raise HTTPException(
                status_code=404,
                detail="Feature importance not available for this model"
            )
        
        response = FeatureImportanceResponse(
            features=features,
            model_name=model_service.model_name
        )
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get feature importance: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get feature importance: {str(e)}"
        )


@router.get("/model/info", response_model=ModelInfoResponse)
async def get_model_info(
    model_service: ModelService = Depends(get_model_service)
):
    """
    Get information about the current model.
    
    **Returns:**
    - Model name and version
    - Model type
    - Training date
    - Performance metrics
    - Features count
    """
    try:
        logger.info("Fetching model information")
        
        info = model_service.get_model_info()
        
        response = ModelInfoResponse(**info)
        
        return response
        
    except Exception as e:
        logger.error(f"Failed to get model info: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get model info: {str(e)}"
        )


@router.post("/predict/scenario")
async def predict_scenario(
    base_request: PredictionRequest,
    rainfall_change: float = 0,
    temperature_change: float = 0,
    model_service: ModelService = Depends(get_model_service)
):
    """
    Predict yield under different scenarios (what-if analysis).
    
    **Parameters:**
    - base_request: Base prediction request
    - rainfall_change: Change in rainfall (mm) to simulate
    - temperature_change: Change in temperature (°C) to simulate
    
    **Returns:**
    - Base scenario prediction
    - Modified scenario prediction
    - Impact analysis
    """
    try:
        logger.info("Running scenario analysis")
        
        # Base prediction
        base_data = base_request.dict()
        base_result = model_service.predict(base_data)
        
        # Modified prediction
        modified_data = base_data.copy()
        modified_data['rainfall'] += rainfall_change
        modified_data['temperature'] += temperature_change
        modified_result = model_service.predict(modified_data)
        
        # Calculate impact
        yield_change = modified_result['prediction'] - base_result['prediction']
        percent_change = (yield_change / base_result['prediction']) * 100
        
        return {
            "base_scenario": {
                "rainfall": base_data['rainfall'],
                "temperature": base_data['temperature'],
                "predicted_yield": base_result['prediction']
            },
            "modified_scenario": {
                "rainfall": modified_data['rainfall'],
                "temperature": modified_data['temperature'],
                "predicted_yield": modified_result['prediction']
            },
            "impact_analysis": {
                "yield_change_tons_ha": round(yield_change, 3),
                "percent_change": round(percent_change, 2),
                "interpretation": (
                    f"{'Increase' if yield_change > 0 else 'Decrease'} of "
                    f"{abs(yield_change):.3f} tons/ha ({abs(percent_change):.2f}%)"
                )
            }
        }
        
    except Exception as e:
        logger.error(f"Scenario analysis failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Scenario analysis failed: {str(e)}"
        )