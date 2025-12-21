"""
Model Service for Loading and Making Predictions

Handles model loading, preprocessing, and making predictions.
"""

import joblib
import json
import numpy as np
import pandas as pd
from pathlib import Path
from typing import Dict, List, Optional, Tuple
import logging

logger = logging.getLogger(__name__)


class ModelService:
    """Service for managing ML model and making predictions."""
    
    def __init__(self, model_dir: str = "../models/trained"):
        """
        Initialize the model service.
        
        Args:
            model_dir: Directory containing trained models
        """
        self.model_dir = Path(model_dir)
        self.model = None
        self.scaler = None
        self.metadata = None
        self.model_name = None
        self.feature_names = None
        
        self._load_model()
        self._load_scaler()
        self._load_metadata()
    
    def _load_model(self):
        """Load the trained model."""
        try:
            # Find the best model file
            model_files = list(self.model_dir.glob("best_model_*.pkl"))
            
            if not model_files:
                raise FileNotFoundError(f"No model found in {self.model_dir}")
            
            model_path = model_files[0]
            self.model = joblib.load(model_path)
            self.model_name = model_path.stem.replace("best_model_", "")
            
            logger.info(f"✅ Loaded model: {self.model_name}")
            
        except Exception as e:
            logger.error(f"Failed to load model: {str(e)}")
            raise
    
    def _load_scaler(self):
        """Load the feature scaler."""
        try:
            scaler_path = self.model_dir / "scaler.pkl"
            
            if scaler_path.exists():
                self.scaler = joblib.load(scaler_path)
                logger.info("✅ Loaded scaler")
            else:
                logger.warning("No scaler found - predictions will use unscaled features")
                
        except Exception as e:
            logger.error(f"Failed to load scaler: {str(e)}")
            raise
    
    def _load_metadata(self):
        """Load model metadata."""
        try:
            # Find metadata file
            metadata_files = list(self.model_dir.glob("model_metadata_*.json"))
            
            if metadata_files:
                metadata_path = metadata_files[0]
                with open(metadata_path, 'r') as f:
                    self.metadata = json.load(f)
                
                self.feature_names = self.metadata.get('features_used', [])
                logger.info(f"✅ Loaded metadata with {len(self.feature_names)} features")
            else:
                logger.warning("No metadata found")
                
        except Exception as e:
            logger.error(f"Failed to load metadata: {str(e)}")
            raise
    
    def _engineer_features(self, data: pd.DataFrame) -> pd.DataFrame:
        """
        Create engineered features from input data.
        
        Args:
            data: Input dataframe
        
        Returns:
            Dataframe with engineered features
        """
        df = data.copy()
        
        # 1. Growing Degree Days
        if 'Temperature' in df.columns and 'Sunlight' in df.columns:
            df['Growing_Degree_Days'] = df['Temperature'] * df['Sunlight']
        
        # 2. Water Availability
        if 'Rainfall' in df.columns and 'Soil_Moisture' in df.columns:
            df['Water_Availability'] = df['Rainfall'] * df['Soil_Moisture']
        
        # 3. Climate Stress
        if 'Temperature' in df.columns and 'Humidity' in df.columns:
            df['Climate_Stress'] = df['Temperature'] / (df['Humidity'] + 1)
        
        # 4. Moisture-Temperature Ratio
        if 'Soil_Moisture' in df.columns and 'Temperature' in df.columns:
            df['Moisture_Temp_Ratio'] = df['Soil_Moisture'] / (df['Temperature'] + 1)
        
        # 5. Rainfall per Sunlight Hour
        if 'Rainfall' in df.columns and 'Sunlight' in df.columns:
            df['Rainfall_per_Sun'] = df['Rainfall'] / (df['Sunlight'] + 1)
        
        # 6. Years since PFJ
        if 'Year' in df.columns and 'PFJ_Policy' in df.columns:
            df['Years_Since_PFJ'] = df.apply(
                lambda row: max(0, row['Year'] - 2017) if row['PFJ_Policy'] == 1 else 0,
                axis=1
            )
        
        # 7. Yield Change (if Yield_Lag1 is provided)
        if 'Yield_Lag1' in df.columns:
            # For prediction, we don't have current yield, so this will be NaN
            # We'll set it to 0 as a placeholder
            df['Yield_Change'] = 0
        
        # 8. Yield Growth Rate
        if 'Yield_Lag1' in df.columns:
            # For prediction, set to 0 as placeholder
            df['Yield_Growth_Rate'] = 0
        
        return df
    
    def _prepare_features(self, input_data: Dict) -> pd.DataFrame:
        """
        Prepare features for prediction.
        
        Args:
            input_data: Dictionary of input features
        
        Returns:
            Prepared feature dataframe
        """
        # Create dataframe from input
        df = pd.DataFrame([input_data])
        
        # Rename columns to match training data (capitalize first letter)
        column_mapping = {
            'district': 'District',
            'year': 'Year',
            'rainfall': 'Rainfall',
            'temperature': 'Temperature',
            'humidity': 'Humidity',
            'sunlight': 'Sunlight',
            'soil_moisture': 'Soil_Moisture',
            'soil_type': 'Soil_Type',
            'pest_risk': 'Pest_Risk',
            'pfj_policy': 'PFJ_Policy',
            'yield_lag1': 'Yield_Lag1'
        }
        
        df = df.rename(columns=column_mapping)
        
        # Engineer features
        df = self._engineer_features(df)
        
        # Select only the features used in training
        if self.feature_names:
            # Only use features that exist in the dataframe
            available_features = [f for f in self.feature_names if f in df.columns]
            df = df[available_features]
        
        return df
    
    def predict(self, input_data: Dict) -> Dict:
        """
        Make a single prediction.
        
        Args:
            input_data: Dictionary of input features
        
        Returns:
            Dictionary with prediction and metadata
        """
        try:
            # Prepare features
            features = self._prepare_features(input_data)
            
            # Make prediction
            prediction = self.model.predict(features)[0]
            
            # Generate insights
            risk_factors = self._identify_risk_factors(input_data)
            recommendations = self._generate_recommendations(input_data, prediction)
            
            return {
                'prediction': float(prediction),
                'confidence_interval': self._calculate_confidence_interval(prediction),
                'risk_factors': risk_factors,
                'recommendations': recommendations,
                'model_version': self.model_name,
                'features_used': len(features.columns)
            }
            
        except Exception as e:
            logger.error(f"Prediction failed: {str(e)}")
            raise
    
    def predict_batch(self, input_data_list: List[Dict]) -> List[Dict]:
        """
        Make batch predictions.
        
        Args:
            input_data_list: List of input feature dictionaries
        
        Returns:
            List of prediction dictionaries
        """
        try:
            predictions = []
            
            for input_data in input_data_list:
                prediction = self.predict(input_data)
                predictions.append(prediction)
            
            return predictions
            
        except Exception as e:
            logger.error(f"Batch prediction failed: {str(e)}")
            raise
    
    def _calculate_confidence_interval(self, prediction: float) -> Dict[str, float]:
        """
        Calculate 95% confidence interval for prediction.
        
        Args:
            prediction: Predicted value
        
        Returns:
            Dictionary with lower and upper bounds
        """
        # Use a conservative estimate based on typical model error
        # In production, this should be based on model's prediction intervals
        std_error = 0.25  # Approximate RMSE
        
        return {
            'lower': float(max(0, prediction - 1.96 * std_error)),
            'upper': float(prediction + 1.96 * std_error)
        }
    
    def _identify_risk_factors(self, input_data: Dict) -> List[str]:
        """
        Identify risk factors based on input conditions.
        
        Args:
            input_data: Input feature dictionary
        
        Returns:
            List of identified risk factors
        """
        risk_factors = []
        
        # Check rainfall
        if input_data.get('rainfall', 0) < 600:
            risk_factors.append("Below optimal rainfall (< 600mm)")
        elif input_data.get('rainfall', 0) > 1000:
            risk_factors.append("Excessive rainfall (> 1000mm)")
        
        # Check temperature
        if input_data.get('temperature', 0) > 30:
            risk_factors.append("High temperature stress (> 30°C)")
        elif input_data.get('temperature', 0) < 20:
            risk_factors.append("Low temperature (< 20°C)")
        
        # Check soil moisture
        if input_data.get('soil_moisture', 0) < 0.5:
            risk_factors.append("Low soil moisture (< 0.5)")
        
        # Check pest risk
        if input_data.get('pest_risk', 0) == 1:
            risk_factors.append("Elevated pest risk detected")
        
        # Check humidity
        if input_data.get('humidity', 0) > 85:
            risk_factors.append("High humidity - increased disease risk")
        
        return risk_factors
    
    def _generate_recommendations(self, input_data: Dict, prediction: float) -> List[str]:
        """
        Generate recommendations based on input and prediction.
        
        Args:
            input_data: Input feature dictionary
            prediction: Predicted yield
        
        Returns:
            List of recommendations
        """
        recommendations = []
        
        # Rainfall recommendations
        if input_data.get('rainfall', 0) < 600:
            recommendations.append("Consider supplementary irrigation during dry spells")
        
        # Temperature recommendations
        if input_data.get('temperature', 0) > 30:
            recommendations.append("Implement mulching to reduce soil temperature")
        
        # Soil moisture recommendations
        if input_data.get('soil_moisture', 0) < 0.5:
            recommendations.append("Improve water retention with organic matter")
        
        # Pest recommendations
        if input_data.get('pest_risk', 0) == 1:
            recommendations.append("Implement integrated pest management strategies")
            recommendations.append("Consider resistant maize varieties")
        
        # PFJ Policy recommendations
        if input_data.get('pfj_policy', 0) == 0:
            recommendations.append("Consider enrolling in PFJ program for subsidies")
        
        # General recommendations based on prediction
        if prediction < 1.5:
            recommendations.append("Yield below average - review soil fertility and management")
        elif prediction > 2.5:
            recommendations.append("Excellent conditions - maintain current practices")
        
        return recommendations[:5]  # Return top 5 recommendations
    
    def get_feature_importance(self, top_n: int = 15) -> List[Dict]:
        """
        Get feature importance from the model.
        
        Args:
            top_n: Number of top features to return
        
        Returns:
            List of dictionaries with feature names and importance scores
        """
        if not hasattr(self.model, 'feature_importances_'):
            return []
        
        importance_data = []
        
        if self.feature_names:
            importances = self.model.feature_importances_
            
            for feature, importance in zip(self.feature_names, importances):
                importance_data.append({
                    'feature': feature,
                    'importance': float(importance)
                })
            
            # Sort by importance and return top N
            importance_data.sort(key=lambda x: x['importance'], reverse=True)
            return importance_data[:top_n]
        
        return []
    
    def get_model_info(self) -> Dict:
        """
        Get model information.
        
        Returns:
            Dictionary with model metadata
        """
        info = {
            'model_name': self.model_name,
            'model_version': '1.0.0',
            'model_type': type(self.model).__name__ if self.model else 'Unknown',
            'features_count': len(self.feature_names) if self.feature_names else 0
        }
        
        if self.metadata:
            info['training_date'] = self.metadata.get('training_date', 'Unknown')
            info['performance_metrics'] = self.metadata.get('test_metrics', {})
        
        return info