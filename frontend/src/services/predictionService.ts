import api from './api';
import {
  PredictionInput,
  PredictionApiRequest,
  PredictionApiResponse,
  PredictionResult,
  PredictionHistory,
  DashboardStats,
} from '../types';
import { STORAGE_KEYS } from '../utils/constants';

class PredictionService {
  /**
   * Convert frontend input format to backend API format
   */
  private transformToApiFormat(input: PredictionInput): PredictionApiRequest {
    return {
      district: input.district,
      year: input.year,
      rainfall: input.rainfall,
      temperature: input.temperature,
      humidity: input.humidity,
      sunlight: input.sunlight,
      soil_moisture: input.soilMoisture,
      pest_risk: input.pestRisk > 50 ? 1 : 0, // Convert 0-100 to 0/1
      pfj_policy: input.pfjPolicy ? 1 : 0, // Convert boolean to 0/1
      yield_lag1: input.yieldLag1,
    };
  }

  /**
   * Convert backend API response to frontend format
   */
  private transformFromApiFormat(
    apiResponse: PredictionApiResponse,
    input: PredictionInput,
    userId: string
  ): PredictionResult {
    return {
      id: 'pred-' + Date.now(),
      userId: userId,
      input: input,
      predictedYield: apiResponse.prediction,
      confidence: this.calculateConfidence(apiResponse.confidence_interval),
      confidenceInterval: apiResponse.confidence_interval,
      riskFactors: apiResponse.risk_factors || [],
      recommendations: apiResponse.recommendations || [],
      modelVersion: apiResponse.model_version,
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Calculate confidence percentage from confidence interval
   */
  private calculateConfidence(interval: { lower: number; upper: number }): number {
    // Convert confidence interval to a 0-1 confidence score
    // Smaller interval = higher confidence
    const range = interval.upper - interval.lower;
    const maxRange = 2.0; // Assume max reasonable range is 2 tons/ha
    const confidence = Math.max(0.5, 1 - (range / maxRange));
    return parseFloat(confidence.toFixed(2));
  }

  /**
   * Save prediction to local storage for history
   */
  private savePrediction(prediction: PredictionResult): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PREDICTIONS);
      const predictions: PredictionResult[] = stored ? JSON.parse(stored) : [];
      
      // Add new prediction at the beginning
      predictions.unshift(prediction);
      
      // Keep only the last 50 predictions
      const trimmed = predictions.slice(0, 50);
      
      localStorage.setItem(STORAGE_KEYS.PREDICTIONS, JSON.stringify(trimmed));
    } catch (error) {
      console.error('Failed to save prediction to storage:', error);
    }
  }

  /**
   * Get stored predictions from local storage
   */
  private getStoredPredictions(): PredictionResult[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PREDICTIONS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load predictions from storage:', error);
      return [];
    }
  }

  /**
   * Create a new prediction
   */
  async createPrediction(input: PredictionInput): Promise<PredictionResult> {
    const apiInput = this.transformToApiFormat(input);
    const apiResponse = await api.post<PredictionApiResponse>('/predict', apiInput);
    
    // Get current user ID (fallback to 'local-user' if not authenticated)
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    const userId = userData ? JSON.parse(userData).id : 'local-user';
    
    const result = this.transformFromApiFormat(apiResponse, input, userId);
    
    // Save to local storage
    this.savePrediction(result);
    
    return result;
  }

  /**
   * Get prediction by ID from local storage
   */
  async getPredictionById(id: string): Promise<PredictionResult> {
    const predictions = this.getStoredPredictions();
    const prediction = predictions.find(p => p.id === id);
    
    if (!prediction) {
      throw new Error('Prediction not found');
    }
    
    return prediction;
  }

  /**
   * Get prediction history with pagination
   */
  async getPredictionHistory(
    page: number = 1,
    limit: number = 10
  ): Promise<PredictionHistory> {
    const allPredictions = this.getStoredPredictions();
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const predictions = allPredictions.slice(startIndex, endIndex);
    
    return {
      predictions,
      total: allPredictions.length,
      page,
      limit,
    };
  }

  /**
   * Get recent predictions
   */
  async getRecentPredictions(limit: number = 5): Promise<PredictionResult[]> {
    const predictions = this.getStoredPredictions();
    return predictions.slice(0, limit);
  }

  /**
   * Delete a prediction from local storage
   */
  async deletePrediction(id: string): Promise<void> {
    const predictions = this.getStoredPredictions();
    const filtered = predictions.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PREDICTIONS, JSON.stringify(filtered));
  }

  /**
   * Get dashboard statistics from stored predictions
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const predictions = this.getStoredPredictions();
    
    if (predictions.length === 0) {
      return {
        totalPredictions: 0,
        averageYield: 0,
        mostUsedCrop: 'Maize',
        trendData: [],
      };
    }
    
    // Calculate average yield
    const totalYield = predictions.reduce((sum, p) => sum + p.predictedYield, 0);
    const averageYield = totalYield / predictions.length;
    
    // Get last prediction date
    const lastPredictionDate = predictions[0]?.createdAt;
    
    // Create trend data from predictions (group by month)
    const trendMap = new Map<string, { sum: number; count: number }>();
    
    predictions.forEach(pred => {
      const date = new Date(pred.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      const existing = trendMap.get(monthKey) || { sum: 0, count: 0 };
      existing.sum += pred.predictedYield;
      existing.count += 1;
      trendMap.set(monthKey, existing);
    });
    
    const trendData = Array.from(trendMap.entries())
      .map(([date, { sum, count }]) => ({
        date,
        yield: sum / count,
        crop: 'Maize',
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-12); // Last 12 months
    
    return {
      totalPredictions: predictions.length,
      averageYield: parseFloat(averageYield.toFixed(2)),
      lastPredictionDate,
      mostUsedCrop: 'Maize',
      trendData,
    };
  }

  /**
   * Export predictions as CSV (browser download)
   */
  async exportPredictions(): Promise<void> {
    const predictions = this.getStoredPredictions();
    
    if (predictions.length === 0) {
      throw new Error('No predictions to export');
    }
    
    // Create CSV content
    const headers = [
      'ID',
      'Date',
      'District',
      'Year',
      'Predicted Yield',
      'Confidence',
      'Rainfall',
      'Temperature',
      'Humidity',
      'Sunlight',
      'Soil Moisture',
      'Pest Risk',
      'PFJ Policy',
    ];
    
    const rows = predictions.map(p => [
      p.id,
      new Date(p.createdAt).toLocaleDateString(),
      p.input.district,
      p.input.year,
      p.predictedYield.toFixed(2),
      (p.confidence * 100).toFixed(0) + '%',
      p.input.rainfall,
      p.input.temperature,
      p.input.humidity,
      p.input.sunlight,
      p.input.soilMoisture,
      p.input.pestRisk,
      p.input.pfjPolicy ? 'Yes' : 'No',
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `maize-predictions-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Clear all predictions from storage
   */
  async clearAllPredictions(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.PREDICTIONS);
  }
}

export default new PredictionService();