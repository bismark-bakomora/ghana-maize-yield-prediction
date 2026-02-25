"""
Model Training Module for Ghana Maize Yield Prediction Project

This module provides production-ready model training functionality
including multiple algorithms, evaluation, and model persistence.
"""

import pandas as pd
import numpy as np
from pathlib import Path
import joblib
import json
import logging
from datetime import datetime
from typing import Dict, List, Tuple, Optional, Any

from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import StackingRegressor
from sklearn.model_selection import RandomizedSearchCV
from scipy.stats import randint, uniform
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import xgboost as xgb
import lightgbm as lgb

# Project root directory
BASE_DIR = Path(__file__).resolve().parents[2]

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ModelTrainer:
    """
    Comprehensive model training pipeline for maize yield prediction.
    
    Supports multiple algorithms with evaluation and persistence.
    """
    
    def __init__(self, random_state: int = 42):
        """
        Initialize the model trainer.
        
        Args:
            random_state: Random seed for reproducibility
        """
        self.random_state = random_state
        self.models = {}
        self.results = []
        self.best_model = None
        self.best_model_name = None
        
        np.random.seed(random_state)
    
    def get_model_config(self) -> Dict[str, Any]:
        """
        Get default model configurations.
        
        Returns:
            Dictionary of model configurations
        """
        return {
            'linear_regression': {
                'model': LinearRegression(),
                'scaled': True
            },
            'ridge': {
                'model': Ridge(alpha=1.0, random_state=self.random_state),
                'scaled': True
            },
            'lasso': {
                'model': Lasso(alpha=0.01, random_state=self.random_state, max_iter=10000),
                'scaled': True
            },
            'decision_tree': {
                'model': DecisionTreeRegressor(
                    max_depth=10,
                    min_samples_split=20,
                    min_samples_leaf=10,
                    random_state=self.random_state
                ),
                'scaled': False
            },
            'random_forest': {
                'model': RandomForestRegressor(
                    n_estimators=200,
                    max_depth=15,
                    min_samples_split=10,
                    min_samples_leaf=5,
                    max_features='sqrt',
                    random_state=self.random_state,
                    n_jobs=-1
                ),
                'scaled': False,
                'param_dist': {
                    'n_estimators': randint(100, 400),
                    'max_depth': randint(4, 20),
                    'min_samples_split': randint(2, 20),
                    'min_samples_leaf': randint(1, 10),
                    'max_features': ['sqrt', 'log2', None]
                }
            },
            'gradient_boosting': {
                'model': GradientBoostingRegressor(
                    n_estimators=200,
                    learning_rate=0.1,
                    max_depth=5,
                    min_samples_split=10,
                    min_samples_leaf=5,
                    subsample=0.8,
                    random_state=self.random_state
                ),
                'scaled': False,
                'param_dist': {
                    'n_estimators': randint(100, 400),
                    'learning_rate': uniform(0.01, 0.3),
                    'max_depth': randint(3, 10),
                    'subsample': uniform(0.5, 0.5)
                }
            },
            'xgboost': {
                'model': xgb.XGBRegressor(
                    n_estimators=200,
                    learning_rate=0.1,
                    max_depth=6,
                    min_child_weight=3,
                    subsample=0.8,
                    colsample_bytree=0.8,
                    gamma=0.1,
                    random_state=self.random_state,
                    n_jobs=-1,
                    verbosity=0
                ),
                'scaled': False,
                'param_dist': {
                    'n_estimators': randint(100, 400),
                    'learning_rate': uniform(0.01, 0.3),
                    'max_depth': randint(3, 10),
                    'min_child_weight': randint(1, 6),
                    'subsample': uniform(0.6, 0.4),
                    'colsample_bytree': uniform(0.6, 0.4)
                }
            },
            'lightgbm': {
                'model': lgb.LGBMRegressor(
                    n_estimators=200,
                    learning_rate=0.1,
                    max_depth=6,
                    num_leaves=31,
                    min_child_samples=20,
                    subsample=0.8,
                    colsample_bytree=0.8,
                    random_state=self.random_state,
                    n_jobs=-1,
                    verbose=-1
                ),
                'scaled': False,
                'param_dist': {
                    'n_estimators': randint(100, 400),
                    'learning_rate': uniform(0.01, 0.3),
                    'num_leaves': randint(20, 150),
                    'min_child_samples': randint(5, 50),
                    'subsample': uniform(0.5, 0.5)
                }
            }
        }
    
    def evaluate_model(self, y_true: np.ndarray, y_pred: np.ndarray, 
                      model_name: str, split: str = 'val') -> Dict[str, Any]:
        """
        Calculate comprehensive evaluation metrics.
        
        Args:
            y_true: True values
            y_pred: Predicted values
            model_name: Name of the model
            split: Dataset split ('train', 'val', or 'test')
        
        Returns:
            Dictionary of metrics
        """
        rmse = np.sqrt(mean_squared_error(y_true, y_pred))
        mae = mean_absolute_error(y_true, y_pred)
        r2 = r2_score(y_true, y_pred)
        mape = np.mean(np.abs((y_true - y_pred) / (y_true + 1e-8))) * 100
        
        return {
            'model': model_name,
            'split': split,
            'rmse': float(rmse),
            'mae': float(mae),
            'r2': float(r2),
            'mape': float(mape)
        }
    
    def train_model(
        self,
        model_name: str,
        X_train: pd.DataFrame,
        y_train: pd.Series,
        X_val: pd.DataFrame,
        y_val: pd.Series,
        model_config: Optional[Dict] = None
    ) -> Tuple[Any, Dict, Dict]:
        """
        Train a single model and evaluate on train and validation sets.
        
        Args:
            model_name: Name of the model
            X_train: Training features
            y_train: Training target
            X_val: Validation features
            y_val: Validation target
            model_config: Optional custom model configuration
        
        Returns:
            Tuple of (trained_model, train_metrics, val_metrics)
        """
        logger.info(f"Training {model_name}...")
        
        # Get model configuration
        if model_config is None:
            model_config = self.get_model_config()[model_name]
        
        model = model_config['model']
        
        # Train model
        # If model supports early stopping, use validation set to avoid overfitting
        try:
            if isinstance(model, xgb.XGBRegressor) or isinstance(model, lgb.LGBMRegressor):
                model.fit(
                    X_train,
                    y_train,
                    eval_set=[(X_val, y_val)],
                    early_stopping_rounds=20,
                    verbose=False,
                )
            else:
                model.fit(X_train, y_train)
        except TypeError:
            # Some wrappers may not accept eval_set; fallback to basic fit
            model.fit(X_train, y_train)

        # Make predictions
        train_pred = model.predict(X_train)
        val_pred = model.predict(X_val)

        # Evaluate
        train_metrics = self.evaluate_model(y_train, train_pred, model_name, 'train')
        val_metrics = self.evaluate_model(y_val, val_pred, model_name, 'val')

        logger.info(f"  Train R²: {train_metrics['r2']:.4f} | Val R²: {val_metrics['r2']:.4f}")

        return model, train_metrics, val_metrics

    def tune_model(self, model, param_dist, X_train, y_train, n_iter: int = 10):
        """
        Tune model hyperparameters using RandomizedSearchCV.
        """
        try:
            rs = RandomizedSearchCV(
                estimator=model,
                param_distributions=param_dist,
                n_iter=n_iter,
                scoring='r2',
                cv=3,
                random_state=self.random_state,
                n_jobs=-1
            )
            rs.fit(X_train, y_train)
            logger.info(f"Tuning complete. Best params: {rs.best_params_}")
            return rs.best_estimator_
        except Exception as e:
            logger.warning(f"Hyperparameter tuning failed: {e}")
            return model
    
    def train_all_models(
        self,
        X_train: pd.DataFrame,
        y_train: pd.Series,
        X_val: pd.DataFrame,
        y_val: pd.Series,
        X_train_scaled: Optional[pd.DataFrame] = None,
        y_train_scaled: Optional[pd.Series] = None,
        X_val_scaled: Optional[pd.DataFrame] = None,
        y_val_scaled: Optional[pd.Series] = None,
        models_to_train: Optional[List[str]] = None,
        oversample: bool = True,
        tune: bool = False,
        tune_n_iter: int = 10,
        stacking: bool = False
    ) -> Dict[str, Any]:
        """
        Train all configured models.
        
        Args:
            X_train: Training features (unscaled)
            y_train: Training target
            X_val: Validation features (unscaled)
            y_val: Validation target
            X_train_scaled: Training features (scaled) for linear models
            y_train_scaled: Training target (scaled)
            X_val_scaled: Validation features (scaled)
            y_val_scaled: Validation target (scaled)
            models_to_train: Optional list of specific models to train
        
        Returns:
            Dictionary with all results
        """
        logger.info("=" * 80)
        logger.info("TRAINING ALL MODELS")
        logger.info("=" * 80)
        
        model_configs = self.get_model_config()
        
        # Filter models if specified
        if models_to_train:
            model_configs = {k: v for k, v in model_configs.items() if k in models_to_train}
        
        trained_models_for_ensemble = {}

        for model_name, config in model_configs.items():
            # Use scaled or unscaled data based on model type
            if config['scaled'] and X_train_scaled is not None:
                X_tr, y_tr = X_train_scaled, y_train_scaled
                X_v, y_v = X_val_scaled, y_val_scaled
            else:
                X_tr, y_tr = X_train, y_train
                X_v, y_v = X_val, y_val
            
            # IMPORTANT: Tune on clean (non-oversampled) data to avoid leakage.
            # Hyperparams should be selected based on the original distribution.
            model_to_train = config['model']
            if tune and 'param_dist' in config:
                model_to_train = self.tune_model(model_to_train, config['param_dist'], X_tr, y_tr, n_iter=tune_n_iter)
                logger.info(f"Using tuned hyperparams for {model_name}")
            
            # Optionally oversample training data to improve performance on rare targets.
            # This happens AFTER tuning so oversample only affects the final fit.
            X_tr_train, y_tr_train = X_tr, y_tr  # Keep original for validation
            if oversample:
                try:
                    from imblearn.over_sampling import RandomOverSampler

                    # Bin the continuous target into quantiles to create strata
                    bins = pd.qcut(y_tr_train, q=5, labels=False, duplicates='drop')

                    # concatenate X and y so we oversample rows consistently
                    train_join = pd.concat([X_tr_train.reset_index(drop=True), y_tr_train.reset_index(drop=True)], axis=1)

                    ros = RandomOverSampler(random_state=self.random_state)
                    resampled_array, _ = ros.fit_resample(train_join, bins)

                    resampled_df = pd.DataFrame(resampled_array, columns=train_join.columns)

                    # convert numeric columns back to numeric types
                    for c in X_tr_train.columns:
                        if pd.api.types.is_numeric_dtype(X_tr_train[c]):
                            resampled_df[c] = pd.to_numeric(resampled_df[c], errors='coerce')

                    y_col = y_tr_train.name
                    resampled_df[y_col] = pd.to_numeric(resampled_df[y_col], errors='coerce')

                    X_tr_train = resampled_df[X_tr_train.columns]
                    y_tr_train = resampled_df[y_col]
                    logger.info(f"Oversampled training set for {model_name}: {len(X_tr_train)} samples")
                except Exception as e:
                    logger.warning(f"Oversampling failed or imblearn not installed: {e}")

            # If stacking requested for ensemble, handle after individual models
            model, train_metrics, val_metrics = self.train_model(
                model_name, X_tr_train, y_tr_train, X_v, y_v, {**config, 'model': model_to_train}
            )
            
            # Store results
            self.models[model_name] = model
            trained_models_for_ensemble[model_name] = model
            self.results.extend([train_metrics, val_metrics])
        
        # Select best model based on validation R²
        val_results = [r for r in self.results if r['split'] == 'val']
        best_result = max(val_results, key=lambda x: x['r2'])
        self.best_model_name = best_result['model']
        self.best_model = self.models[self.best_model_name]

        # Optionally build a stacking ensemble from top models
        if stacking:
            try:
                # pick top 3 models by val r2
                top_models = sorted(
                    [r for r in val_results],
                    key=lambda x: x['r2'],
                    reverse=True
                )[:3]
                estimators = [(m['model'], self.models[m['model']]) for m in top_models]
                stack = StackingRegressor(estimators=estimators, final_estimator=Ridge())
                # train on full train (X_train, y_train) provided externally isn't accessible here,
                # so we return the stacking estimator for downstream user to fit if desired.
                self.models['stacking'] = stack
                logger.info(f"Prepared stacking ensemble with: {', '.join([n for n,_ in estimators])}")
            except Exception as e:
                logger.warning(f"Failed to build stacking ensemble: {e}")
        
        logger.info("\n" + "=" * 80)
        logger.info(f"BEST MODEL: {self.best_model_name}")
        logger.info(f"Validation R²: {best_result['r2']:.4f}")
        logger.info("=" * 80)
        
        return {
            'models': self.models,
            'results': self.results,
            'best_model': self.best_model,
            'best_model_name': self.best_model_name
        }
    
    def evaluate_on_test(
        self,
        X_test: pd.DataFrame,
        y_test: pd.Series,
        X_test_scaled: Optional[pd.DataFrame] = None,
        y_test_scaled: Optional[pd.Series] = None
    ) -> Dict[str, Any]:
        """
        Evaluate the best model on the test set.
        
        Args:
            X_test: Test features (unscaled)
            y_test: Test target
            X_test_scaled: Test features (scaled)
            y_test_scaled: Test target (scaled)
        
        Returns:
            Dictionary of test metrics
        """
        if self.best_model is None:
            raise ValueError("No model has been trained yet!")
        
        logger.info("\n" + "=" * 80)
        logger.info("EVALUATING ON TEST SET")
        logger.info("=" * 80)
        
        # Determine if model needs scaled data
        model_config = self.get_model_config()[self.best_model_name]
        
        if model_config['scaled'] and X_test_scaled is not None:
            X_t, y_t = X_test_scaled, y_test_scaled
        else:
            X_t, y_t = X_test, y_test
        
        # Make predictions
        test_pred = self.best_model.predict(X_t)
        
        # Evaluate
        test_metrics = self.evaluate_model(y_t, test_pred, self.best_model_name, 'test')
        
        logger.info(f"\n{self.best_model_name} Test Performance:")
        logger.info(f"  R² Score: {test_metrics['r2']:.4f}")
        logger.info(f"  RMSE:     {test_metrics['rmse']:.4f} tons/ha")
        logger.info(f"  MAE:      {test_metrics['mae']:.4f} tons/ha")
        logger.info(f"  MAPE:     {test_metrics['mape']:.2f}%")
        
        return test_metrics
    
    def get_feature_importance(self, feature_names: List[str], top_n: int = 15) -> pd.DataFrame:
        """
        Get feature importance for the best model (if available).
        
        Args:
            feature_names: List of feature names
            top_n: Number of top features to return
        
        Returns:
            DataFrame with feature importances
        """
        if self.best_model is None:
            raise ValueError("No model has been trained yet!")
        
        if not hasattr(self.best_model, 'feature_importances_'):
            logger.warning(f"{self.best_model_name} does not support feature importance")
            return pd.DataFrame()
        
        importance_df = pd.DataFrame({
            'feature': feature_names,
            'importance': self.best_model.feature_importances_
        }).sort_values('importance', ascending=False).head(top_n)
        
        return importance_df
    
    def save_model(
        self,
        output_dir: str,
        feature_names: List[str],
        additional_metadata: Optional[Dict] = None
    ):
        """
        Save the best model and metadata.
        
        Args:
            output_dir: Directory to save model
            feature_names: List of feature names used
            additional_metadata: Optional additional metadata to save
        """
        if self.best_model is None:
            raise ValueError("No model has been trained yet!")
        
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)
        
        # Save model
        model_filename = f'best_model_{self.best_model_name}.pkl'
        joblib.dump(self.best_model, output_path / model_filename)
        logger.info(f"Saved model to {output_path / model_filename}")
        
        # Prepare metadata
        test_results = [r for r in self.results if r['split'] == 'test']
        test_metrics = test_results[0] if test_results else {}
        
        metadata = {
            'model_name': self.best_model_name,
            'model_type': type(self.best_model).__name__,
            'training_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'features_used': feature_names,
            'n_features': len(feature_names),
            'test_metrics': test_metrics,
            'hyperparameters': self.best_model.get_params() if hasattr(self.best_model, 'get_params') else {},
            'random_state': self.random_state
        }
        
        if additional_metadata:
            metadata.update(additional_metadata)
        
        # Save metadata
        metadata_filename = f'model_metadata_{self.best_model_name}.json'
        with open(output_path / metadata_filename, 'w') as f:
            json.dump(metadata, f, indent=4)
        logger.info(f"Saved metadata to {output_path / metadata_filename}")
        
        # Save all results
        results_df = pd.DataFrame(self.results)
        results_filename = 'all_model_results.csv'
        results_df.to_csv(output_path / results_filename, index=False)
        logger.info(f"Saved all results to {output_path / results_filename}")
        
        # Save model config to explicitly mark this as the best model for the API
        config = {
            'best_model_name': self.best_model_name,
            'last_updated': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'description': f"Test R²: {test_metrics.get('r2', 0):.4f}, RMSE: {test_metrics.get('rmse', 0):.4f}"
        }
        config_filename = 'model_config.json'
        with open(output_path / config_filename, 'w') as f:
            json.dump(config, f, indent=4)
        logger.info(f"Saved model config to {output_path / config_filename}")
    
    def load_model(self, model_path: str, metadata_path: Optional[str] = None):
        """
        Load a saved model.
        
        Args:
            model_path: Path to the saved model
            metadata_path: Optional path to metadata file
        """
        self.best_model = joblib.load(model_path)
        logger.info(f"Loaded model from {model_path}")
        
        if metadata_path:
            with open(metadata_path, 'r') as f:
                metadata = json.load(f)
            self.best_model_name = metadata.get('model_name')
            logger.info(f"Loaded metadata from {metadata_path}")


def train_models(
    data_dir: str,
    output_dir: str,
    models_to_train: Optional[List[str]] = None,
    evaluate_test: bool = True,
    oversample: bool = True,
    tune: bool = False,
    tune_n_iter: int = 10,
    stacking: bool = False
) -> ModelTrainer:
    """
    Convenience function for complete model training pipeline.
    
    Args:
        data_dir: Directory containing processed data
        output_dir: Directory to save trained models
        models_to_train: Optional list of specific models to train
        evaluate_test: Whether to evaluate on test set
    
    Returns:
        Trained ModelTrainer instance
    """
    logger.info("=" * 80)
    logger.info("MAIZE YIELD PREDICTION - MODEL TRAINING")
    logger.info("=" * 80)
    
    # Load data
    data_path = Path(data_dir).resolve()
    
    # Unscaled data
    train_df = pd.read_csv(data_path / 'train.csv')
    val_df = pd.read_csv(data_path / 'validation.csv')
    test_df = pd.read_csv(data_path / 'test.csv')
    
    # Scaled data
    train_scaled = pd.read_csv(data_path / 'train_scaled.csv')
    val_scaled = pd.read_csv(data_path / 'validation_scaled.csv')
    test_scaled = pd.read_csv(data_path / 'test_scaled.csv')
    
    logger.info(f"Loaded data:")
    logger.info(f"  Training: {len(train_df)} samples")
    logger.info(f"  Validation: {len(val_df)} samples")
    logger.info(f"  Test: {len(test_df)} samples")
    
    # Define features
    exclude_features = ['District', 'Year', 'Yield', 'Soil_Type']
    features = [col for col in train_df.columns if col not in exclude_features]
    
    logger.info(f"\nUsing {len(features)} features")
    
    # Prepare data
    X_train, y_train = train_df[features], train_df['Yield']
    X_val, y_val = val_df[features], val_df['Yield']
    X_test, y_test = test_df[features], test_df['Yield']
    
    X_train_scaled, y_train_scaled = train_scaled[features], train_scaled['Yield']
    X_val_scaled, y_val_scaled = val_scaled[features], val_scaled['Yield']
    X_test_scaled, y_test_scaled = test_scaled[features], test_scaled['Yield']
    
    # Initialize trainer
    trainer = ModelTrainer(random_state=42)
    
    # Train all models
    trainer.train_all_models(
        X_train, y_train, X_val, y_val,
        X_train_scaled, y_train_scaled, X_val_scaled, y_val_scaled,
        models_to_train=models_to_train,
        oversample=oversample,
        tune=tune,
        tune_n_iter=tune_n_iter,
        stacking=stacking
    )
    
    # Evaluate on test set
    if evaluate_test:
        test_metrics = trainer.evaluate_on_test(
            X_test, y_test, X_test_scaled, y_test_scaled
        )
    
    # Save model
    trainer.save_model(
        output_dir=output_dir,
        feature_names=features,
        additional_metadata={
            'training_samples': len(train_df),
            'validation_samples': len(val_df),
            'test_samples': len(test_df)
        }
    )
    
    logger.info("\n" + "=" * 80)
    logger.info("MODEL TRAINING COMPLETE!")
    logger.info("=" * 80)
    
    return trainer


if __name__ == '__main__':
    """
    Example usage of the model training module.
    """
    # Define paths
    data_dir = BASE_DIR / 'data' / 'processed'
    output_dir = BASE_DIR / 'models' / 'trained'

    
    # Train models
    trainer = train_models(
        data_dir=data_dir,
        output_dir=output_dir,
        evaluate_test=True
    )
    
    print(f"\n✅ Best model: {trainer.best_model_name}")
    print(f"✅ Models saved to: {output_dir}")