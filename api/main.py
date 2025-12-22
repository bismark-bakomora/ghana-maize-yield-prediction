"""
FastAPI Main Application for Ghana Maize Yield Prediction

This is the main FastAPI application entry point that coordinates
all routes, middleware, and application configuration.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from pathlib import Path
import logging
from datetime import datetime

from api.routes import prediction, health, data
from api.services.model_service import ModelService

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Ghana Maize Yield Prediction API",
    description="AI-powered API for predicting maize crop yields across Ghana",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize model service on startup
@app.on_event("startup")
async def startup_event():
    """Load ML model on application startup."""
    try:
        logger.info("=" * 80)
        logger.info("STARTING GHANA MAIZE YIELD PREDICTION API")
        logger.info("=" * 80)
        
        # Initialize model service
        model_service = ModelService()
        app.state.model_service = model_service
        
        logger.info(f"✅ Model loaded: {model_service.model_name}")
        logger.info(f"✅ API ready to serve predictions")
        logger.info("=" * 80)
        
    except Exception as e:
        logger.error(f"❌ Failed to load model: {str(e)}")
        raise

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on application shutdown."""
    logger.info("Shutting down Ghana Maize Yield Prediction API")

# Include routers
app.include_router(health.router, prefix="/api/v1", tags=["Health"])
app.include_router(prediction.router, prefix="/api/v1", tags=["Prediction"])
app.include_router(data.router, prefix="/api/v1", tags=["Data"])

# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """Root endpoint with API information."""
    return {
        "name": "Ghana Maize Yield Prediction API",
        "version": "1.0.0",
        "status": "running",
        "timestamp": datetime.now().isoformat(),
        "docs": "/docs",
        "health": "/api/v1/health"
    }

# Global exception handler
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Handle HTTP exceptions."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "status_code": exc.status_code,
            "timestamp": datetime.now().isoformat()
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handle general exceptions."""
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": str(exc),
            "status_code": 500,
            "timestamp": datetime.now().isoformat()
        }
    )
