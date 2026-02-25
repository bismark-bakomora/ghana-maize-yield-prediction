"""Regenerate train/val/test splits from raw data to fix corruption."""

from src.data.data_preprocessor import MaizeDataPreprocessor
from pathlib import Path
import pandas as pd

# Load raw data
raw_data = pd.read_csv(Path('data/processed/maize_data_processed.csv'))

# Preprocess
preprocessor = MaizeDataPreprocessor(random_state=42)
output = preprocessor.fit_transform(
    raw_data,
    outlier_method='cap'
)

# Save all splits
output['train'].to_csv('data/processed/train.csv', index=False)
output['validation'].to_csv('data/processed/validation.csv', index=False)
output['test'].to_csv('data/processed/test.csv', index=False)
output['train_scaled'].to_csv('data/processed/train_scaled.csv', index=False)
output['validation_scaled'].to_csv('data/processed/validation_scaled.csv', index=False)
output['test_scaled'].to_csv('data/processed/test_scaled.csv', index=False)

# Save scaler
preprocessor.save_artifacts(Path('models/trained'), 'scaler.pkl')

print('✅ Preprocessing complete and files saved!')

# Verify the new splits
print('\nVerifying splits...')
train = pd.read_csv('data/processed/train.csv')
val = pd.read_csv('data/processed/validation.csv')
test = pd.read_csv('data/processed/test.csv')

print(f"Train: {len(train)}, mean Yield: {train['Yield'].mean():.3f}, std: {train['Yield'].std():.3f}")
print(f"Val:   {len(val)}, mean Yield: {val['Yield'].mean():.3f}, std: {val['Yield'].std():.3f}")
print(f"Test:  {len(test)}, mean Yield: {test['Yield'].mean():.3f}, std: {test['Yield'].std():.3f}")
