from fastapi import APIRouter, Request
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/health")
async def health_check(request: Request):
    """
    Check API health status.
    
    Returns system status and model availability.
    """
    try:
        model_service = request.app.state.model_service
        model_loaded = model_service.model is not None
        
        return {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "model_loaded": model_loaded,
            "model_name": model_service.model_name if model_loaded else None,
            "api_version": "1.0.0"
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return {
            "status": "unhealthy",
            "timestamp": datetime.now().isoformat(),
            "error": str(e)
        }


@router.get("/health/ready")
async def readiness_check(request: Request):
    """
    Check if API is ready to serve requests.
    
    Returns readiness status for Kubernetes probes.
    """
    try:
        model_service = request.app.state.model_service
        
        if model_service.model is None:
            return {
                "ready": False,
                "reason": "Model not loaded"
            }
        
        return {
            "ready": True,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "ready": False,
            "reason": str(e)
        }


@router.get("/health/live")
async def liveness_check():
    """
    Check if API is alive.
    
    Returns liveness status for Kubernetes probes.
    """
    return {
        "alive": True,
        "timestamp": datetime.now().isoformat()
    }
