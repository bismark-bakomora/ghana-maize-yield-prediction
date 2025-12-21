from fastapi import APIRouter, HTTPException
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/districts")
async def get_districts():
    districts = [
        "Accra", "Kumasi", "Tamale", "Takoradi", "Cape Coast",
        "Ho", "Koforidua", "Sunyani", "Wa", "Bolgatanga",
        "Techiman", "Obuasi", "Tema", "Winneba", "Akim Oda",
        "Yendi", "Bawku", "Nkawkaw", "Mampong", "Keta",
        "Hohoe", "Konongo", "Nsawam", "Goaso", "Berekum"
    ]

    return {
        "districts": sorted(districts),
        "total": len(districts)
    }


@router.get("/soil-types")
async def get_soil_types():
    soil_types = [
        {
            "name": "Forest Ochrosol",
            "description": "Well-drained forest soils, most common in Ghana",
            "suitability": "High"
        },
        {
            "name": "Coastal Savannah",
            "description": "Sandy coastal soils",
            "suitability": "Medium"
        },
        {
            "name": "Tropical Black Earth",
            "description": "High organic matter soils",
            "suitability": "High"
        },
        {
            "name": "Savanna Ochrosol",
            "description": "Northern savanna soils",
            "suitability": "Medium"
        }
    ]

    return {
        "soil_types": soil_types,
        "total": len(soil_types)
    }


@router.get("/parameters/ranges")
async def get_parameter_ranges():
    ranges = {
        "rainfall": {
            "min": 300,
            "max": 1500,
            "unit": "mm",
            "optimal_min": 600,
            "optimal_max": 1000,
            "description": "Annual rainfall"
        },
        "temperature": {
            "min": 20,
            "max": 35,
            "unit": "°C",
            "optimal_min": 24,
            "optimal_max": 30,
            "description": "Average temperature"
        },
        "humidity": {
            "min": 40,
            "max": 100,
            "unit": "%",
            "optimal_min": 60,
            "optimal_max": 85,
            "description": "Relative humidity"
        },
        "sunlight": {
            "min": 4,
            "max": 12,
            "unit": "hours",
            "optimal_min": 6,
            "optimal_max": 8,
            "description": "Daily sunlight hours"
        },
        "soil_moisture": {
            "min": 0.3,
            "max": 0.9,
            "unit": "proportion",
            "optimal_min": 0.5,
            "optimal_max": 0.75,
            "description": "Soil moisture content"
        },
        "year": {
            "min": 2020,
            "max": 2030,
            "unit": "year",
            "description": "Prediction year"
        }
    }

    return {"parameters": ranges}


@router.get("/statistics/historical")
async def get_historical_statistics():
    statistics = {
        "national_average": {
            "mean_yield": 2.15,
            "median_yield": 2.20,
            "std_yield": 0.45,
            "min_yield": 0.27,
            "max_yield": 4.00,
            "unit": "tons/ha"
        },
        "by_region": [
            {"region": "Ashanti", "avg_yield": 2.35, "sample_size": 450},
            {"region": "Brong Ahafo", "avg_yield": 2.28, "sample_size": 380},
            {"region": "Northern", "avg_yield": 1.95, "sample_size": 320},
            {"region": "Eastern", "avg_yield": 2.42, "sample_size": 410},
            {"region": "Volta", "avg_yield": 2.18, "sample_size": 290}
        ],
        "trends": {
            "2011_2015_avg": 1.85,
            "2016_2021_avg": 2.35,
            "growth_rate": "27%"
        },
        "data_period": "2011-2021"
    }

    return statistics


@router.get("/recommendations/general")
async def get_general_recommendations():
    recommendations = {
        "best_practices": [
            {
                "category": "Soil Preparation",
                "recommendations": [
                    "Test soil pH before planting (optimal: 6.0-7.5)",
                    "Apply organic matter to improve soil structure",
                    "Practice crop rotation to maintain soil fertility"
                ]
            },
            {
                "category": "Water Management",
                "recommendations": [
                    "Ensure adequate drainage to prevent waterlogging",
                    "Apply mulch to conserve soil moisture",
                    "Consider drip irrigation in low rainfall areas"
                ]
            },
            {
                "category": "Pest Management",
                "recommendations": [
                    "Scout fields regularly for pest presence",
                    "Use integrated pest management (IPM) strategies",
                    "Plant resistant varieties when available"
                ]
            },
            {
                "category": "PFJ Program",
                "recommendations": [
                    "Register for subsidized inputs",
                    "Attend farmer training sessions",
                    "Form or join farmer cooperatives"
                ]
            }
        ],
        "optimal_conditions": {
            "rainfall": "600-1000 mm annually",
            "temperature": "24-30°C",
            "soil_type": "Well-drained loamy soils",
            "planting_density": "50,000-70,000 plants/ha"
        }
    }

    return recommendations
