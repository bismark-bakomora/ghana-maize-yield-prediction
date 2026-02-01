"""
Data Preprocessing Module for Ghana Maize Yield Prediction Project.

This module provides production-ready data preprocessing functions
for cleaning, transforming, and preparing maize yield data for modeling.
"""

import pandas as pd
import numpy as np
from pathlib import Path
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
import joblib
import json
import logging
from typing import Tuple, Dict, List, Optional

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def _to_python_type(value):
    """Convert NumPy types to native Python types for JSON serialization."""
    if isinstance(value, (np.integer,)):
        return int(value)
    if isinstance(value, (np.floating,)):
        return float(value)
    return value


class MaizeDataPreprocessor:
    """
    Comprehensive data preprocessing pipeline for maize yield prediction.
    
    This class handles:
    - Missing value imputation
    - Duplicate removal
    - Outlier detection and treatment
    - Feature engineering
    - Feature scaling
    - Train/validation/test splitting
    """
    
    def __init__(self, random_state: int = 42):
        """
        Initialize the preprocessor.
        
        Args:
            random_state: Random seed for reproducibility
        """
        self.random_state = random_state
        self.scaler = StandardScaler()
        self.encoders = {}
        self.feature_names = None
        self.preprocessing_stats = {}
        
        np.random.seed(random_state)
        
    def handle_missing_values(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Handle missing values using appropriate strategies.
        
        Args:
            df: Input dataframe
            
        Returns:
            DataFrame with missing values handled
        """
        logger.info("Handling missing values...")
        df = df.copy()
        missing_before = df.isnull().sum().sum()
        
        # Sort by district and year for forward fill
        df = df.sort_values(['District', 'Year'])
        
        # Handle Yield_Lag1 with forward fill within districts
        if 'Yield_Lag1' in df.columns:
            df['Yield_Lag1'] = df.groupby('District')['Yield_Lag1'].ffill()
        
        # Handle numerical columns with district-level median
        numerical_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        for col in numerical_cols:
            if df[col].isnull().any():
                df[col] = df.groupby('District')[col].transform(lambda x: x.fillna(x.median()))
        
        # Handle categorical columns with mode
        categorical_cols = df.select_dtypes(include=['object']).columns.tolist()
        for col in categorical_cols:
            if df[col].isnull().any():
                df[col] = df[col].fillna(df[col].mode()[0])
        
        missing_after = df.isnull().sum().sum()
        self.preprocessing_stats['missing_values_handled'] = missing_before - missing_after
        
        logger.info(f"Missing values: {missing_before} → {missing_after}")
        return df
    
    def remove_duplicates(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Remove duplicate rows and District-Year combinations.
        
        Args:
            df: Input dataframe
            
        Returns:
            DataFrame with duplicates removed
        """
        logger.info("Removing duplicates...")
        df = df.copy()
        
        # Remove exact duplicates
        before = len(df)
        df = df.drop_duplicates()
        exact_dups = before - len(df)
        
        # Remove District-Year duplicates (keep first)
        before = len(df)
        df = df.drop_duplicates(subset=['District', 'Year'], keep='first')
        district_year_dups = before - len(df)
        
        total_removed = exact_dups + district_year_dups
        self.preprocessing_stats['duplicates_removed'] = total_removed
        
        logger.info(f"Removed {total_removed} duplicates ({exact_dups} exact, {district_year_dups} District-Year)")
        return df
    
    def detect_outliers_iqr(self, data: pd.Series, multiplier: float = 1.5) -> Tuple[pd.Series, float, float]:
        """
        Detect outliers using the IQR method.
        
        Args:
            data: Pandas Series
            multiplier: IQR multiplier (default 1.5)
            
        Returns:
            Tuple of (outlier_mask, lower_bound, upper_bound)
        """
        Q1 = data.quantile(0.25)
        Q3 = data.quantile(0.75)
        IQR = Q3 - Q1
        lower_bound = Q1 - multiplier * IQR
        upper_bound = Q3 + multiplier * IQR
        outliers = (data < lower_bound) | (data > upper_bound)
        return outliers, lower_bound, upper_bound
    
    def handle_outliers(self, df: pd.DataFrame, method: str = 'cap') -> pd.DataFrame:
        """
        Handle outliers using specified method.
        
        Args:
            df: Input dataframe
            method: 'cap' (cap at bounds), 'remove' (remove outliers), or 'keep'
            
        Returns:
            DataFrame with outliers handled
        """
        logger.info(f"Handling outliers using method: {method}")
        df = df.copy()
        
        features_to_check = ['Yield', 'Rainfall', 'Temperature', 'Humidity', 'Sunlight', 'Soil_Moisture']
        total_outliers = 0
        
        for feature in features_to_check:
            if feature not in df.columns:
                continue
                
            outliers, lower, upper = self.detect_outliers_iqr(df[feature])
            n_outliers = outliers.sum()
            total_outliers += n_outliers
            
            if method == 'cap' and n_outliers > 0:
                df.loc[df[feature] < lower, feature] = lower
                df.loc[df[feature] > upper, feature] = upper
            elif method == 'remove' and n_outliers > 0:
                df = df[~outliers]
        
        self.preprocessing_stats['outliers_handled'] = total_outliers
        logger.info(f"Handled {total_outliers} outliers")
        return df
    
    def engineer_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Create engineered features for improved model performance.
        
        Args:
            df: Input dataframe
            
        Returns:
            DataFrame with engineered features
        """
        logger.info("Engineering features...")
        df = df.copy()
        features_created = 0
        
        # 1. Growing Degree Days
        if 'Temperature' in df.columns and 'Sunlight' in df.columns:
            df['Growing_Degree_Days'] = df['Temperature'] * df['Sunlight']
            features_created += 1
        
        # 2. Water Availability Index
        if 'Rainfall' in df.columns and 'Soil_Moisture' in df.columns:
            df['Water_Availability'] = df['Rainfall'] * df['Soil_Moisture']
            features_created += 1
        
        # 3. Climate Stress Index
        if 'Temperature' in df.columns and 'Humidity' in df.columns:
            df['Climate_Stress'] = df['Temperature'] / (df['Humidity'] + 1)
            features_created += 1
        
        # 4. Moisture-Temperature Ratio
        if 'Soil_Moisture' in df.columns and 'Temperature' in df.columns:
            df['Moisture_Temp_Ratio'] = df['Soil_Moisture'] / (df['Temperature'] + 1)
            features_created += 1
        
        # 5. Rainfall per Sunlight Hour
        if 'Rainfall' in df.columns and 'Sunlight' in df.columns:
            df['Rainfall_per_Sun'] = df['Rainfall'] / (df['Sunlight'] + 1)
            features_created += 1
        
        # 6. Years since PFJ start
        if 'Year' in df.columns and 'PFJ_Policy' in df.columns:
            df['Years_Since_PFJ'] = df.apply(
                lambda row: max(0, row['Year'] - 2017) if row['PFJ_Policy'] == 1 else 0,
                axis=1
            )
            features_created += 1
        
        # 7. Yield Change
        if 'Yield' in df.columns and 'Yield_Lag1' in df.columns:
            df['Yield_Change'] = df['Yield'] - df['Yield_Lag1']
            features_created += 1
        
        # 8. Yield Growth Rate
        if 'Yield' in df.columns and 'Yield_Lag1' in df.columns:
            df['Yield_Growth_Rate'] = (df['Yield'] - df['Yield_Lag1']) / (df['Yield_Lag1'] + 0.001)
            features_created += 1
        
        self.preprocessing_stats['features_engineered'] = features_created
        logger.info(f"Created {features_created} engineered features")
        return df
    
    def split_data(
        self,
        df: pd.DataFrame,
        train_size: float = 0.60,
        val_size: float = 0.20,
        test_size: float = 0.20
    ) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
        """
        Split data into train/validation/test sets using train_test_split.
        
        Args:
            df: Input dataframe
            train_size: Proportion for training (default: 0.60)
            val_size: Proportion for validation (default: 0.20)
            test_size: Proportion for testing (default: 0.20)
            
        Returns:
            Tuple of (train_df, val_df, test_df)
        """
        logger.info("Splitting data into train/validation/test sets...")
        
        # Validate that proportions sum to 1.0
        total_size = train_size + val_size + test_size
        if not np.isclose(total_size, 1.0):
            raise ValueError(f"Sizes must sum to 1.0, got {total_size}")
        
        # First split: train and temp (val + test)
        train_df, temp_df = train_test_split(
            df,
            test_size=(val_size + test_size),
            random_state=self.random_state,
            shuffle=True
        )
        
        # Second split: validation and test from temp
        val_df, test_df = train_test_split(
            temp_df,
            test_size=(test_size / (val_size + test_size)),
            random_state=self.random_state,
            shuffle=True
        )
        
        logger.info(f"Train: {len(train_df)} samples ({len(train_df)/len(df)*100:.1f}%)")
        logger.info(f"Validation: {len(val_df)} samples ({len(val_df)/len(df)*100:.1f}%)")
        logger.info(f"Test: {len(test_df)} samples ({len(test_df)/len(df)*100:.1f}%)")
        
        return train_df, val_df, test_df
    
    def scale_features(
        self,
        train_df: pd.DataFrame,
        val_df: pd.DataFrame,
        test_df: pd.DataFrame,
        features_to_scale: Optional[List[str]] = None
    ) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
        """
        Scale numerical features using StandardScaler.
        
        Args:
            train_df: Training dataframe
            val_df: Validation dataframe
            test_df: Test dataframe
            features_to_scale: List of features to scale (auto-detected if None)
            
        Returns:
            Tuple of scaled (train_df, val_df, test_df)
        """
        logger.info("Scaling features...")
        
        if features_to_scale is None:
            numerical_features = train_df.select_dtypes(include=[np.number]).columns.tolist()
            features_to_scale = [col for col in numerical_features if col not in ['Yield', 'Year']]
        
        self.scaler.fit(train_df[features_to_scale])
        self.feature_names = features_to_scale
        
        train_scaled = train_df.copy()
        val_scaled = val_df.copy()
        test_scaled = test_df.copy()
        
        train_scaled[features_to_scale] = self.scaler.transform(train_df[features_to_scale])
        val_scaled[features_to_scale] = self.scaler.transform(val_df[features_to_scale])
        test_scaled[features_to_scale] = self.scaler.transform(test_df[features_to_scale])
        
        logger.info(f"Scaled {len(features_to_scale)} features")
        return train_scaled, val_scaled, test_scaled
    
    def fit_transform(
        self,
        df: pd.DataFrame,
        outlier_method: str = 'cap',
        train_size: float = 0.60,
        val_size: float = 0.20,
        test_size: float = 0.20
    ) -> Dict[str, pd.DataFrame]:
        """
        Complete preprocessing pipeline: fit and transform.
        
        Args:
            df: Input dataframe
            outlier_method: Method for handling outliers ('cap' or 'remove')
            train_size: Proportion for training (default: 0.60)
            val_size: Proportion for validation (default: 0.20)
            test_size: Proportion for testing (default: 0.20)
        """
        logger.info("=" * 80)
        logger.info("STARTING COMPLETE PREPROCESSING PIPELINE")
        logger.info("=" * 80)
        
        df = self.handle_missing_values(df)
        df = self.remove_duplicates(df)
        df = self.handle_outliers(df, method=outlier_method)
        df = self.engineer_features(df)
        
        train_df, val_df, test_df = self.split_data(df, train_size, val_size, test_size)
        train_scaled, val_scaled, test_scaled = self.scale_features(train_df, val_df, test_df)
        
        logger.info("=" * 80)
        logger.info("PREPROCESSING PIPELINE COMPLETE")
        logger.info("=" * 80)
        
        return {
            'full_processed': df,
            'train': train_df,
            'validation': val_df,
            'test': test_df,
            'train_scaled': train_scaled,
            'validation_scaled': val_scaled,
            'test_scaled': test_scaled
        }
    
    def transform(self, df: pd.DataFrame, scale: bool = True) -> pd.DataFrame:
        """
        Transform new data using fitted preprocessor.
        """
        logger.info("Transforming new data...")
        
        df = self.handle_missing_values(df)
        df = self.engineer_features(df)
        
        if scale and self.feature_names is not None:
            df_scaled = df.copy()
            df_scaled[self.feature_names] = self.scaler.transform(df[self.feature_names])
            return df_scaled
        
        return df
    
    def save_artifacts(self, output_dir: str, docs_dir: Optional[str] = None):
        """
        Save preprocessing artifacts (scaler, encoders, metadata).
        """
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)
        
        joblib.dump(self.scaler, output_path / 'scaler.pkl')
        
        metadata = {
            'feature_names': self.feature_names,
            'preprocessing_stats': {
                k: _to_python_type(v) for k, v in self.preprocessing_stats.items()
            },
            'random_state': self.random_state
        }
        
        with open(output_path / 'preprocessing_metadata.json', 'w', encoding='utf-8') as f:
            json.dump(metadata, f, indent=4)
        
        if docs_dir is None:
            docs_dir = '../docs'
        docs_path = Path(docs_dir)
        docs_path.mkdir(parents=True, exist_ok=True)
        
        summary = self._generate_preprocessing_summary()
        with open(docs_path / 'preprocessing_summary.md', 'w', encoding='utf-8') as f:
            f.write(summary)
    
    def _generate_preprocessing_summary(self) -> str:
        """Generate a markdown summary of preprocessing steps."""
        return f"""# Data Preprocessing Summary

Generated: {pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S')}
"""
    
    def load_artifacts(self, input_dir: str):
        """
        Load preprocessing artifacts.
        """
        input_path = Path(input_dir)
        self.scaler = joblib.load(input_path / 'scaler.pkl')
        
        with open(input_path / 'preprocessing_metadata.json', 'r') as f:
            metadata = json.load(f)
        
        self.feature_names = metadata['feature_names']
        self.preprocessing_stats = metadata['preprocessing_stats']


def preprocess_data(
    input_path: str,
    output_dir: str,
    outlier_method: str = 'cap',
    save_artifacts: bool = True
) -> Dict[str, pd.DataFrame]:
    """
    Convenience function for complete data preprocessing.
    """
    df = pd.read_csv(input_path)
    
    preprocessor = MaizeDataPreprocessor(random_state=42)
    datasets = preprocessor.fit_transform(df, outlier_method=outlier_method)
    
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    
    for name, data in datasets.items():
        if name != 'full_processed':
            data.to_csv(output_path / f'{name}.csv', index=False)
    
    datasets['full_processed'].to_csv(output_path / 'maize_data_processed.csv', index=False)
    
    if save_artifacts:
        preprocessor.save_artifacts(Path(output_dir) / 'artifacts')
    
    return datasets


if __name__ == '__main__':
    """
    Example usage of the preprocessing module.
    """
    BASE_DIR = Path(__file__).resolve().parents[2]
    raw_data_path = BASE_DIR / 'data' / 'raw' / 'Maize_dataset.csv'
    processed_data_dir = BASE_DIR / 'data' / 'processed'

    
    datasets = preprocess_data(
        input_path=raw_data_path,
        output_dir=processed_data_dir,
        outlier_method='cap',
        save_artifacts=True
    )
    
    print("\n" + "=" * 80)
    print("PREPROCESSING COMPLETE!")
    print("=" * 80)
    print(f"\nProcessed datasets saved to: {processed_data_dir}")
    print("\nAvailable datasets:")
    for name, data in datasets.items():
        print(f"  - {name}: {data.shape}")
