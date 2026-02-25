"""
Model Service for Loading and Making Predictions

Handles model loading, preprocessing, and predictions.
"""

import joblib
import json
import numpy as np
import pandas as pd
from pathlib import Path
from typing import Dict, List
import logging

logger = logging.getLogger(__name__)


class ModelService:
    """Service for managing ML model and making predictions."""

    def __init__(self, model_dir: str | None = None):
        """
        Initialize the model service.

        Args:
            model_dir: Directory containing trained models
        """
        # Resolve base directory safely
        base_dir = Path(__file__).resolve().parents[2]

        self.model_dir = (
            Path(model_dir)
            if model_dir
            else base_dir / "models" / "trained"
        )

        self.model = None
        self.scaler = None
        self.metadata = None
        self.model_name = None
        self.feature_names = []
        self.config = None

        self._load_config()
        self._load_model()
        self._load_scaler()
        self._load_metadata()

    # ------------------------------------------------------------------
    # Model & Artifacts Loading
    # ------------------------------------------------------------------

    def _load_config(self):
        """Load model configuration to determine which model to use."""
        config_path = self.model_dir / "model_config.json"
        if config_path.exists():
            try:
                with open(config_path, "r") as f:
                    self.config = json.load(f)
                logger.info(f"✅ Loaded model config: {self.config.get('best_model_name')}")
            except Exception as e:
                logger.warning(f"⚠️ Failed to load config: {e}")
                self.config = None
        else:
            logger.warning(f"⚠️ No model_config.json found in {self.model_dir}")
            self.config = None

    def _load_model(self):
        # If config specifies a model, use that; otherwise fall back to glob pattern
        if self.config and "best_model_name" in self.config:
            model_path = self.model_dir / f"best_model_{self.config['best_model_name']}.pkl"
            if model_path.exists():
                self.model = joblib.load(model_path)
                self.model_name = self.config['best_model_name']
                logger.info(f"✅ Loaded model from config: {self.model_name}")
                return

        # Fallback: use first matching model file
        model_files = list(self.model_dir.glob("best_model_*.pkl"))
        if not model_files:
            logger.warning(f"⚠️ No trained model found in {self.model_dir}")
            self.model = None
            return

        model_path = model_files[0]
        self.model = joblib.load(model_path)
        self.model_name = model_path.stem.replace("best_model_", "")
        logger.warning(f"⚠️ No config found; loaded first available model: {self.model_name}")

    def _load_scaler(self):
        scaler_path = self.model_dir / "scaler.pkl"
        if scaler_path.exists():
            self.scaler = joblib.load(scaler_path)
            logger.info("✅ Loaded scaler")
        else:
            logger.warning("⚠️ No scaler found. Features will not be scaled.")

    def _load_metadata(self):
        # If config specifies a model, use its metadata
        if self.config and "best_model_name" in self.config:
            metadata_path = self.model_dir / f"model_metadata_{self.config['best_model_name']}.json"
            if metadata_path.exists():
                with open(metadata_path, "r") as f:
                    self.metadata = json.load(f)
                self.feature_names = self.metadata.get("features_used", [])
                logger.info(f"✅ Loaded metadata ({len(self.feature_names)} features)")
                return

        # Fallback: use first matching metadata file
        metadata_files = list(self.model_dir.glob("model_metadata_*.json"))
        if not metadata_files:
            logger.warning("⚠️ No metadata file found")
            return

        metadata_path = metadata_files[0]
        with open(metadata_path, "r") as f:
            self.metadata = json.load(f)

        self.feature_names = self.metadata.get("features_used", [])
        logger.warning(f"⚠️ No config found; using first available metadata ({len(self.feature_names)} features)")

    # ------------------------------------------------------------------
    # Feature Engineering
    # ------------------------------------------------------------------

    def _engineer_features(self, df: pd.DataFrame) -> pd.DataFrame:
        data = df.copy()

        # Core interactions and ratios derived from inputs only (no leakage)
        if {"Temperature", "Sunlight"} <= set(data.columns):
            # proxy for heat accumulation across the season
            data["Growing_Degree_Days"] = data["Temperature"] * data["Sunlight"]
            # additional interaction retained for model experiments
            data["Temp_Sun_Interaction"] = data["Temperature"] * data["Sunlight"]

        if {"Rainfall", "Soil_Moisture"} <= set(data.columns):
            # water available to plants combining precipitation and retention
            data["Water_Availability"] = data["Rainfall"] * data["Soil_Moisture"]
            # direct ratio to capture rainfall efficiency given soil moisture
            data["Rainfall_per_Moisture"] = data["Rainfall"] / (data["Soil_Moisture"] + 1)

        if {"Temperature", "Humidity"} <= set(data.columns):
            # higher temperature with low humidity increases stress
            data["Climate_Stress"] = data["Temperature"] / (data["Humidity"] + 1)

        if {"Soil_Moisture", "Temperature"} <= set(data.columns):
            data["Moisture_Temp_Ratio"] = data["Soil_Moisture"] / (data["Temperature"] + 1)

        if {"Rainfall", "Sunlight"} <= set(data.columns):
            data["Rainfall_per_Sun"] = data["Rainfall"] / (data["Sunlight"] + 1)

        if {"Year", "PFJ_Policy"} <= set(data.columns):
            # years since PFJ program started (2017) only when policy is present
            data["Years_Since_PFJ"] = data.apply(
                lambda r: max(0, int(r["Year"]) - 2017) if int(r.get("PFJ_Policy", 0)) == 1 else 0,
                axis=1,
            )

        # Pest and soil interactions (use only input fields)
        if {"Pest_Risk", "Soil_Moisture"} <= set(data.columns):
            # captures risk amplification when pests are high and moisture low
            data["Pest_Soil_Risk"] = data["Pest_Risk"] * (1 - data["Soil_Moisture"])

        # Safe defaults for yield-derived features: compute only from provided lags
        # Do NOT use the target `Yield` anywhere (prevents leakage)
        if "Yield_Lag1" in data.columns:
            # If user provided a second lag (historical previous yield), compute change/growth
            if "Yield_Lag2" in data.columns and pd.notna(data.loc[0, "Yield_Lag2"]):
                try:
                    y1 = float(data.loc[0, "Yield_Lag1"])
                    y2 = float(data.loc[0, "Yield_Lag2"])
                except Exception:
                    # fallback to zeros if values are malformed
                    data["Yield_Change"] = 0.0
                    data["Yield_Growth_Rate"] = 0.0
                else:
                    data["Yield_Change"] = y1 - y2
                    data["Yield_Growth_Rate"] = (y1 - y2) / (abs(y2) + 1e-6)
            else:
                # keep consistent behaviour when only one lag is available
                data["Yield_Change"] = 0.0
                data["Yield_Growth_Rate"] = 0.0

        return data

    def _prepare_features(self, input_data: Dict) -> pd.DataFrame:
        df = pd.DataFrame([input_data])

        column_mapping = {
            "district": "District",
            "year": "Year",
            "rainfall": "Rainfall",
            "temperature": "Temperature",
            "humidity": "Humidity",
            "sunlight": "Sunlight",
            "soil_moisture": "Soil_Moisture",
            "soil_type": "Soil_Type",
            "pest_risk": "Pest_Risk",
            "pfj_policy": "PFJ_Policy",
            "yield_lag1": "Yield_Lag1",
            "yield_lag2": "Yield_Lag2",
        }

        df = df.rename(columns=column_mapping)
        df = self._engineer_features(df)

        if self.feature_names:
            missing = set(self.feature_names) - set(df.columns)
            if missing:
                raise ValueError(f"Missing required features: {missing}")

            df = df[self.feature_names]

        return df

    # ------------------------------------------------------------------
    # Prediction
    # ------------------------------------------------------------------

    def predict(self, input_data: Dict) -> Dict:
        """Make a single prediction."""
        if self.model is None:
            raise RuntimeError("Model not loaded. Train and save a model first.")

        features = self._prepare_features(input_data)

        if self.scaler:
            features = pd.DataFrame(
                self.scaler.transform(features),
                columns=features.columns,
            )

        prediction = float(self.model.predict(features)[0])

        return {
            # ✅ Updated to match PredictionResponse schema
            "prediction": prediction,
            "confidence_interval": self._confidence_interval(prediction),
            "risk_factors": self._identify_risks(input_data),
            "recommendations": self._recommend_actions(input_data, prediction),
            "model_version": self.model_name,
            "features_used": len(features.columns),
        }

    def predict_batch(self, inputs: List[Dict]) -> List[Dict]:
        return [self.predict(item) for item in inputs]

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    def _confidence_interval(self, prediction: float) -> Dict[str, float]:
        std_error = 0.25
        return {
            "lower": max(0.0, prediction - 1.96 * std_error),
            "upper": prediction + 1.96 * std_error,
        }

    def _identify_risks(self, data: Dict) -> List[str]:
        risks = []

        if data.get("rainfall", 0) < 600:
            risks.append("Low rainfall")
        if data.get("rainfall", 0) > 1000:
            risks.append("Excess rainfall")
        if data.get("temperature", 0) > 30:
            risks.append("High temperature stress")
        if data.get("soil_moisture", 0) < 0.5:
            risks.append("Low soil moisture")
        if data.get("pest_risk") == 1:
            risks.append("High pest risk")

        return risks

    def _recommend_actions(self, data: Dict, prediction: float) -> List[str]:
        recs = []

        if data.get("rainfall", 0) < 600:
            recs.append("Use supplementary irrigation")
        if data.get("soil_moisture", 0) < 0.5:
            recs.append("Improve soil organic matter")
        if data.get("pest_risk") == 1:
            recs.append("Apply integrated pest management")
        if data.get("pfj_policy", 0) == 0:
            recs.append("Enroll in PFJ support program")

        if prediction < 1.5:
            recs.append("Review soil fertility and crop management")
        elif prediction > 2.5:
            recs.append("Maintain current best practices")

        return recs[:5]

    # ------------------------------------------------------------------
    # Metadata
    # ------------------------------------------------------------------

    def get_model_info(self) -> Dict:
        return {
            "name": self.model_name,
            "type": type(self.model).__name__ if self.model else "Unavailable",
            "features": len(self.feature_names),
            "training_date": self.metadata.get("training_date") if self.metadata else None,
            "metrics": self.metadata.get("test_metrics") if self.metadata else None,
        }
