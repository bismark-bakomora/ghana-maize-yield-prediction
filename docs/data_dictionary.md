# Ghana Maize Yield Prediction - Data Dictionary

**Project**: Ghana Maize Yield Prediction System  
**Author**: Group 4 databloom (bismark bakomora)  
**Last Updated**: December 2025  
**Version**: 1.0

---

## Table of Contents
1. [Dataset Overview](#dataset-overview)
2. [Raw Data Fields](#raw-data-fields)
3. [Engineered Features](#engineered-features)
4. [Data Processing Notes](#data-processing-notes)
5. [Data Quality Metrics](#data-quality-metrics)

---

## Dataset Overview

### Source Information
- **Dataset Name**: Ghana Maize Yield Dataset
- **File Name**: `Maize_dataset.csv`
- **Time Period**: 2011 - 2021 (11 years)
- **Geographic Coverage**: Multiple districts across Ghana
- **Total Records**: ~3,400+ observations
- **Data Collection**: District agricultural extension offices, Ghana Meteorological Agency

### Purpose
This dataset is designed for predicting maize crop yields across different districts in Ghana using environmental factors, soil conditions, agricultural policies, and historical yield data.

---

## Raw Data Fields

### 1. District
- **Type**: Categorical (String)
- **Description**: Name of the district in Ghana where the data was collected
- **Example Values**: 
  - A.M.A (Accra Metropolitan Assembly)
  - Kumasi
  - Tamale
  - Ho
- **Total Unique Values**: 260+ districts
- **Missing Values**: None
- **Notes**: Districts are administrative units in Ghana. Some districts may have been created or renamed during the study period.

---

### 2. Year
- **Type**: Numerical (Integer)
- **Description**: Calendar year of the harvest/observation
- **Range**: 2011 - 2021
- **Unit**: Year
- **Missing Values**: None
- **Notes**: 
  - Some districts may not have data for all years
  - 2017 marks the start of the PFJ (Planting for Food and Jobs) policy

---

### 3. Yield (TARGET VARIABLE)
- **Type**: Numerical (Float)
- **Description**: Maize crop yield per hectare
- **Unit**: Tons per hectare (tons/ha)
- **Range**: 0.27 - 4.00 tons/ha
- **Mean**: ~2.15 tons/ha
- **Missing Values**: None
- **Notes**: 
  - This is the primary target variable for prediction
  - National average yield for maize in Ghana is approximately 1.5-2.5 tons/ha
  - Higher yields (>3 tons/ha) indicate highly productive conditions

---

### 4. Rainfall
- **Type**: Numerical (Float)
- **Description**: Total annual rainfall recorded in the district
- **Unit**: Millimeters (mm)
- **Range**: 369.81 - 1229.97 mm
- **Mean**: ~720 mm
- **Missing Values**: Rare (<1%)
- **Notes**: 
  - Critical factor for rain-fed agriculture
  - Ghana has two main seasons: wet season (April-October) and dry season (November-March)
  - Optimal range for maize: 600-1000 mm

---

### 5. Temperature
- **Type**: Numerical (Float)
- **Description**: Average annual temperature for the district
- **Unit**: Degrees Celsius (°C)
- **Range**: 24.39 - 29.65°C
- **Mean**: ~26.5°C
- **Missing Values**: None
- **Notes**: 
  - Ghana has a tropical climate
  - Optimal temperature for maize growth: 20-30°C
  - Higher temperatures can increase water stress

---

### 6. Humidity
- **Type**: Numerical (Float)
- **Description**: Average relative humidity
- **Unit**: Percentage (%)
- **Range**: 61.82 - 90.38%
- **Mean**: ~82%
- **Missing Values**: None
- **Notes**: 
  - High humidity can increase disease risk
  - Affects water stress and evapotranspiration
  - Coastal areas typically have higher humidity

---

### 7. Sunlight
- **Type**: Numerical (Float)
- **Description**: Average daily sunlight hours
- **Unit**: Hours per day
- **Range**: 14.92 - 20.92 hours
- **Mean**: ~17.5 hours
- **Missing Values**: None
- **Notes**: 
  - Critical for photosynthesis
  - Ghana is near the equator, so day length varies minimally
  - Values represent average daylight + twilight hours

---

### 8. Soil_Moisture
- **Type**: Numerical (Float)
- **Description**: Average soil moisture content
- **Unit**: Volumetric percentage (proportion 0-1)
- **Range**: 0.45 - 0.87
- **Mean**: ~0.65
- **Missing Values**: Rare (<1%)
- **Notes**: 
  - Represents water content in the root zone
  - Optimal range for maize: 0.50-0.75
  - Derived from weather station data and soil type characteristics

---

### 9. Soil_Type
- **Type**: Categorical (String)
- **Description**: Dominant soil classification in the district
- **Categories**:
  - **Forest Ochrosol**: Well-drained forest soils (most common)
  - **Coastal Savannah**: Sandy coastal soils
  - **Tropical Black Earth**: High organic matter soils
  - **Savanna Ochrosol**: Northern savanna soils
- **Distribution**:
  - Forest Ochrosol: ~65%
  - Savanna Ochrosol: ~20%
  - Coastal Savannah: ~10%
  - Tropical Black Earth: ~5%
- **Missing Values**: None
- **Notes**: 
  - Soil type significantly affects water retention and nutrient availability
  - Forest Ochrosol generally has better fertility

---

### 10. Pest_Risk
- **Type**: Binary (Integer)
- **Description**: Indicator of pest pressure/risk
- **Values**: 
  - 0 = No significant pest risk
  - 1 = Elevated pest risk
- **Distribution**: ~40% coded as 1 (pest risk present)
- **Missing Values**: None
- **Notes**: 
  - Based on district agricultural extension reports
  - Common maize pests include: Fall Armyworm, Stem Borers, Aphids
  - Risk assessment became more systematic after 2018

---

### 11. PFJ_Policy
- **Type**: Binary (Integer)
- **Description**: Indicator of whether the Planting for Food and Jobs (PFJ) policy was active
- **Values**: 
  - 0 = Policy not active
  - 1 = Policy active
- **Timeline**: 
  - 0 for years 2011-2016
  - 1 for years 2017-2021
- **Missing Values**: None
- **Notes**: 
  - PFJ is Ghana's flagship agricultural program launched in 2017
  - Provides subsidized seeds, fertilizers, and extension services
  - Significantly impacted agricultural productivity nationwide

---

### 12. Yield_Lag1
- **Type**: Numerical (Float)
- **Description**: Previous year's yield for the same district
- **Unit**: Tons per hectare (tons/ha)
- **Range**: 0.27 - 4.00 tons/ha
- **Missing Values**: Present for first year of each district's data
- **Notes**: 
  - Captures historical performance and soil depletion/regeneration
  - Strong predictor of current year yield
  - Missing for districts' first year of data (imputed using district median)

---

## Engineered Features

These features are created during preprocessing to improve model performance:

### 1. Growing_Degree_Days
- **Formula**: `Temperature × Sunlight`
- **Unit**: °C·hours
- **Purpose**: Captures combined effect of temperature and light availability on plant growth
- **Range**: ~370 - 620

### 2. Water_Availability
- **Formula**: `Rainfall × Soil_Moisture`
- **Unit**: mm·proportion
- **Purpose**: Represents total water available to plants
- **Range**: ~200 - 900

### 3. Climate_Stress
- **Formula**: `Temperature / (Humidity + 1)`
- **Unit**: Unitless ratio
- **Purpose**: Measures atmospheric water demand and plant stress
- **Range**: ~0.27 - 0.48

### 4. Moisture_Temp_Ratio
- **Formula**: `Soil_Moisture / (Temperature + 1)`
- **Unit**: Unitless ratio
- **Purpose**: Balances soil water availability against temperature stress
- **Range**: ~0.017 - 0.032

### 5. Rainfall_per_Sun
- **Formula**: `Rainfall / (Sunlight + 1)`
- **Unit**: mm/hour
- **Purpose**: Efficiency of water availability relative to light
- **Range**: ~20 - 85

### 6. Years_Since_PFJ
- **Formula**: `max(0, Year - 2017) if PFJ_Policy == 1 else 0`
- **Unit**: Years
- **Purpose**: Captures cumulative effect of PFJ policy over time
- **Range**: 0 - 4

### 7. Yield_Change
- **Formula**: `Yield - Yield_Lag1`
- **Unit**: Tons per hectare
- **Purpose**: Year-over-year yield change
- **Range**: -2.5 - 2.5

### 8. Yield_Growth_Rate
- **Formula**: `(Yield - Yield_Lag1) / (Yield_Lag1 + 0.001)`
- **Unit**: Proportion
- **Purpose**: Percentage change in yield
- **Range**: -0.8 - 3.5

---

## Data Processing Notes

### Missing Value Treatment
1. **Yield_Lag1**: Forward fill within each district
2. **Numerical features**: District-level median imputation
3. **Categorical features**: Mode imputation
4. **Total missing values**: <1% of dataset

### Outlier Handling
- **Method**: IQR (Interquartile Range) with 1.5× multiplier
- **Strategy**: Capping at bounds (conservative approach)
- **Features affected**: Yield, Rainfall, Temperature, Humidity, Sunlight, Soil_Moisture
- **Outliers capped**: ~3-5% per feature

### Duplicate Removal
- **Exact duplicates**: Removed
- **District-Year duplicates**: First occurrence kept
- **Total removed**: <1% of records

### Feature Scaling
- **Method**: StandardScaler (zero mean, unit variance)
- **Applied to**: All numerical features except Yield and Year
- **Fitted on**: Training set only (no data leakage)

---

## Data Quality Metrics

### Completeness
- **Overall completeness**: 99.5%
- **Complete district-year records**: 98.8%
- **Districts with full time series**: 75%

### Consistency
- **Duplicate rate**: <0.1%
- **Outlier rate**: 3-5% per feature (capped)
- **Invalid values**: 0%

### Temporal Coverage
- **Start year**: 2011
- **End year**: 2021
- **Total years**: 11
- **Districts per year**: 
  - 2011-2016: ~150-200 districts
  - 2017-2021: ~250-300 districts (increased coverage with PFJ)

### Geographic Coverage
- **Total districts**: 260+
- **Regions covered**: All 16 regions of Ghana
- **Most represented districts**: Kumasi, Accra, Tamale (all years)

---

## Data Splits

### Training Set (2011-2018)
- **Purpose**: Model training
- **Size**: ~70% of data
- **Years**: 8 years
- **Records**: ~2,400 observations

### Validation Set (2019-2020)
- **Purpose**: Hyperparameter tuning and model selection
- **Size**: ~15% of data
- **Years**: 2 years
- **Records**: ~500 observations

### Test Set (2021)
- **Purpose**: Final model evaluation
- **Size**: ~15% of data
- **Years**: 1 year
- **Records**: ~300 observations

**Note**: Time-based split ensures no data leakage and respects temporal ordering.

---

## Usage Guidelines

### For Model Training
1. Use `train_scaled.csv` for models requiring scaled features (SVM, Neural Networks)
2. Use `train.csv` for tree-based models (Random Forest, XGBoost, LightGBM)
3. Always use the same preprocessing pipeline for new data

### For Interpretation
1. Use unscaled data for feature importance interpretation
2. Reference this dictionary when explaining model predictions
3. Consider domain knowledge about Ghanaian agriculture

### For Predictions
1. Ensure new data has all required fields
2. Apply the same feature engineering pipeline
3. Use the saved scaler (`scaler.pkl`) for scaling

---

## References

- Ghana Statistical Service - Agricultural Statistics
- Ghana Meteorological Agency - Climate Data
- Ministry of Food and Agriculture - PFJ Policy Documentation
- FAO Ghana - Agricultural Production Statistics




