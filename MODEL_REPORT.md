# Maize Yield Prediction Project Report

## 1. Introduction

Maize is a staple crop in Ghana, and predicting its yield accurately is important for agricultural planning and food security. This project aims to develop a predictive model for maize yield using historical climate, soil, and policy data, while avoiding target leakage and ensuring realistic evaluation.

**Goal:** Predict annual maize yield (tons per hectare) at the district level using only exogenous features such as weather, soil, and policy indicators.

## 2. Dataset Overview

The original dataset includes the following columns:

| Column | Description |
|--------|-------------|
| Year | Year of observation |
| District | Administrative district in Ghana |
| Rainfall | Total rainfall (mm) |
| Temperature | Mean temperature (°C) |
| Humidity | Mean relative humidity (%) |
| Sunlight | Sunlight hours |
| Soil_Moisture | Average soil moisture (unitless) |
| PFJ_Policy | Indicator for Planting for Food and Jobs program (0/1) |
| Yield | Maize yield (target variable, tons/ha) |

### Key Points

- Initial attempts to include yield-derived features such as Yield_Lag1, Yield_Change, and Yield_Growth_Rate produced an R² of 1, indicating **target leakage**.

## 3. Problem Identification

### 3.1 Target Leakage

Some original features contained information derived from the target variable (Yield), including:

- Yield_Lag1
- Yield_Change
- Yield_Growth_Rate

Including these features allowed the model to "cheat" by effectively giving it the answer, resulting in unrealistic performance.

**Solution:** All extreme yield-derived features were removed to ensure the model only uses exogenous predictors.

### 3.2 Time-Based Split

A random train-test split was used to ensure the model is evaluated on future data, mimicking real-world prediction.

## 4. Feature Engineering

We constructed a set of features derived from climate, soil, and policy data, while avoiding target leakage.

### 4.1 Climate Features

- **Rainfall** – Total rainfall for the year
- **Mean_Temperature** – Average temperature over the year
- **Humidity** – Average relative humidity
- **Sunlight** – Total sunlight hours
- **Soil_Moisture** – Average soil moisture

These are the raw exogenous predictors.

### 4.2 Interaction Features

To capture relationships that affect maize growth:

- **Rainfall_Temp_Ratio** = Annual_Rainfall / (Annual_Mean_Temperature + 1)
- **Moisture_Heat_Index** = Annual_Soil_Moisture × Annual_Mean_Temperature
- **Water_Availability_Index** = Annual_Rainfall + Annual_Soil_Moisture

**Why:** These features approximate effective water availability and stress conditions for maize without using yield information.

### 4.3 Climate Stress Indicators

Binary features highlighting extreme conditions:

- **Drought_Indicator** = 1 if Annual_Rainfall < district mean, else 0
- **Heat_Stress_Indicator** = 1 if Annual_Mean_Temperature > district mean, else 0

**Why:** Maize is highly sensitive to extreme drought and heat. These indicators help the model capture risk factors.

### 4.4 Climate Anomalies

Long-term context per district:

- **Rainfall_Anomaly** = Annual_Rainfall − 10-year district mean
- **Temperature_Anomaly** = Annual_Mean_Temperature − 10-year district mean

**Why:** Anomalies capture unusual weather events relative to the district's normal climate.

### 4.5 Policy & Temporal Features

- **PFJ_Policy** – Indicates whether PFJ program is active
- **Years_Since_PFJ** = Year − PFJ start year

**Why:** Agricultural policies influence fertilizer use, seed quality, and crop management. Years_Since_PFJ helps capture the long-term effect of the program.

### 4.6 Final Feature Matrix

| Feature | Type | Description |
|---------|------|-------------|
| Rainfall | Continuous | Total annual rainfall |
| Mean_Temperature | Continuous | Mean temperature |
| Humidity | Continuous | Average humidity |
| Sunlight | Continuous | Total sunlight hours |
| Soil_Moisture | Continuous | Mean soil moisture |
| Rainfall_Temp_Ratio | Continuous | Rainfall / Temperature |
| Moisture_Heat_Index | Continuous | Soil moisture × Temperature |
| Water_Availability_Index | Continuous | Rainfall + Soil moisture |
| Drought_Indicator | Binary | Low rainfall compared to district mean |
| Heat_Stress_Indicator | Binary | High temperature compared to district mean |
| Rainfall_Anomaly | Continuous | Deviation from 10-year mean rainfall |
| Temperature_Anomaly | Continuous | Deviation from 10-year mean temperature |
| PFJ_Policy | Binary | PFJ policy active or not |
| Years_Since_PFJ | Continuous | Years since PFJ started |

## 5. Modeling Approach

We treat maize yield prediction as a regression problem.

### 5.1 Models Used

- **Linear Regression** – baseline
- **Ridge Regression** – handles multicollinearity and reduces overfitting (α = 0.1)
- **Random Forest Regressor** – tree-based, captures non-linear relationships
- **XGBoost Regressor** – gradient boosting, strong performance on tabular data
- **LightGBM** – gradient boosting framework optimized for speed and handling tabular data

**Why:** Linear models provide interpretability; tree-based models capture complex interactions and non-linear effects common in crop yield data.

### 5.2 Feature Scaling

- **Linear models:** Features were standardized to mean 0 and standard deviation 1 to allow fair coefficient estimation and proper regularization.
- **Tree-based models:** No scaling needed because trees use thresholds, not coefficients.

### 5.3 Train-Test Split

Random-based split ensures realistic evaluation:
- Training: 70%
- Validation: 20%
- Test: 10%

## 6. Results and Evaluation

After removing yield-derived features and retraining:

- **R²:** ~0.6–0.95 (realistic, district-level prediction)
- **RMSE:** ~0.3–0.5 t/ha (depending on model)
- **MAE:** ~0.2–0.4 t/ha

### Observations

- LightGBM, XGBoost, and Random Forest outperform linear models due to non-linear climate-yield relationships.
- Features such as Rainfall_Anomaly and Temperature_Anomaly are consistently among the top predictors.

## 7. Discussion

- Target leakage was the main source of the original R² = 1. Removing yield-derived features gave realistic, interpretable performance.
- Interaction features (e.g., Rainfall_Temp_Ratio) capture effects not visible in raw weather metrics.
- Policy features show measurable influence on yield, justifying their inclusion.
- Using only exogenous variables ensures that predictions can be used in planning and decision-making.

## 8. Conclusion

This project demonstrates a robust methodology for maize yield prediction:

1. Identifying and removing target leakage
2. Constructing meaningful features from climate, soil, and policy data
3. Using both linear and tree-based regression models
4. Evaluating with a time-based train-test split

The final model (XGBoost) predicts maize yield realistically and provides interpretable feature importance for agricultural planning.
