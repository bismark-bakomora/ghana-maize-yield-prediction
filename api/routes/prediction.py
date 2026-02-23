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


# -------------------------------------------------------------------
# Single Prediction
# -------------------------------------------------------------------

@router.post("/predict", response_model=PredictionResponse)
async def predict_yield(
    request: PredictionRequest,
    model_service: ModelService = Depends(get_model_service)
):
    """
    Make a single yield prediction.
    """
    try:
        logger.info(f"Received prediction request for {request.district}, {request.year}")

        input_data = request.dict()
        result = model_service.predict(input_data)

        # Directly return model output (schema-aligned)
        return PredictionResponse(**result)

    except Exception as e:
        logger.error(f"Prediction failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )


# -------------------------------------------------------------------
# Batch Prediction
# -------------------------------------------------------------------

@router.post("/predict/batch", response_model=BatchPredictionResponse)
async def predict_batch(
    request: BatchPredictionRequest,
    model_service: ModelService = Depends(get_model_service)
):
    """
    Make batch yield predictions.
    """
    try:
        start_time = time.time()

        logger.info(f"Received batch prediction request with {len(request.predictions)} items")

        input_data_list = [pred.dict() for pred in request.predictions]
        results = model_service.predict_batch(input_data_list)

        predictions = [PredictionResponse(**result) for result in results]

        processing_time = time.time() - start_time

        return BatchPredictionResponse(
            predictions=predictions,
            total_predictions=len(predictions),
            processing_time_seconds=processing_time
        )

    except Exception as e:
        logger.error(f"Batch prediction failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Batch prediction failed: {str(e)}"
        )


# -------------------------------------------------------------------
# Feature Importance
# -------------------------------------------------------------------

@router.get("/model/features", response_model=FeatureImportanceResponse)
async def get_feature_importance(
    top_n: int = 15,
    model_service: ModelService = Depends(get_model_service)
):
    """
    Get feature importance from the trained model.
    """
    try:
        logger.info(f"Fetching top {top_n} feature importance")

        features = model_service.get_feature_importance(top_n=top_n)

        if not features:
            raise HTTPException(
                status_code=404,
                detail="Feature importance not available for this model"
            )

        return FeatureImportanceResponse(
            features=features,
            model_name=model_service.model_name
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get feature importance: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get feature importance: {str(e)}"
        )


# -------------------------------------------------------------------
# Model Info
# -------------------------------------------------------------------

@router.get("/model/info", response_model=ModelInfoResponse)
async def get_model_info(
    model_service: ModelService = Depends(get_model_service)
):
    """
    Get information about the current model.
    """
    try:
        logger.info("Fetching model information")

        info = model_service.get_model_info()
        return ModelInfoResponse(**info)

    except Exception as e:
        logger.error(f"Failed to get model info: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get model info: {str(e)}"
        )


# -------------------------------------------------------------------
# Scenario Analysis
# -------------------------------------------------------------------

@router.post("/predict/scenario")
async def predict_scenario(
    base_request: PredictionRequest,
    rainfall_change: float = 0,
    temperature_change: float = 0,
    model_service: ModelService = Depends(get_model_service)
):
    """
    Predict yield under different scenarios (what-if analysis).
    """
    try:
        logger.info("Running scenario analysis")

        base_data = base_request.dict()
        base_result = model_service.predict(base_data)

        modified_data = base_data.copy()
        modified_data["rainfall"] += rainfall_change
        modified_data["temperature"] += temperature_change
        modified_result = model_service.predict(modified_data)

        yield_change = (
            modified_result["predicted_yield"]
            - base_result["predicted_yield"]
        )

        percent_change = (
            (yield_change / base_result["predicted_yield"]) * 100
            if base_result["predicted_yield"] != 0
            else 0
        )

        return {
            "base_scenario": {
                "rainfall": base_data["rainfall"],
                "temperature": base_data["temperature"],
                "predicted_yield": base_result["predicted_yield"],
            },
            "modified_scenario": {
                "rainfall": modified_data["rainfall"],
                "temperature": modified_data["temperature"],
                "predicted_yield": modified_result["predicted_yield"],
            },
            "impact_analysis": {
                "yield_change_tons_ha": round(yield_change, 3),
                "percent_change": round(percent_change, 2),
                "interpretation": (
                    "Increase" if yield_change > 0 else "Decrease"
                ),
            },
        }

    except Exception as e:
        logger.error(f"Scenario analysis failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Scenario analysis failed: {str(e)}"
        )
