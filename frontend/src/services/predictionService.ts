import api from './api';
import {
  PredictionInput,
  PredictionResult,
  PredictionHistory,
  DashboardStats,
} from '../types';

// Mock mode for development (set to false when backend is ready)
const MOCK_MODE = true;

class PredictionService {
  async createPrediction(input: PredictionInput): Promise<PredictionResult> {
    if (MOCK_MODE) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock prediction result
      const mockResult: PredictionResult = {
        id: 'pred-' + Date.now(),
        userId: 'mock-user-123',
        input: input,
        predictedYield: parseFloat((Math.random() * 3 + 2).toFixed(2)), // 2-5 Mt/Ha
        confidence: parseFloat((Math.random() * 0.3 + 0.7).toFixed(2)), // 70-100%
        recommendations: [
          'Consider applying nitrogen-rich fertilizer to boost growth',
          'Monitor soil moisture levels closely during the growing season',
          'Plant disease-resistant varieties for this climate',
          'Implement proper spacing between plants for optimal yield'
        ],
        createdAt: new Date().toISOString(),
      };
      
      return mockResult;
    }
    
    return await api.post<PredictionResult>('/predictions', input);
  }

  async getPredictionById(id: string): Promise<PredictionResult> {
    if (MOCK_MODE) {
      throw new Error('Mock prediction not found');
    }
    
    return await api.get<PredictionResult>(`/predictions/${id}`);
  }

  async getPredictionHistory(
    page: number = 1,
    limit: number = 10
  ): Promise<PredictionHistory> {
    if (MOCK_MODE) {
      const mockHistory: PredictionHistory = {
        predictions: [],
        total: 0,
        page,
        limit,
      };
      return mockHistory;
    }
    
    return await api.get<PredictionHistory>('/predictions/history', {
      page,
      limit,
    });
  }

  async getRecentPredictions(limit: number = 5): Promise<PredictionResult[]> {
    if (MOCK_MODE) {
      return [];
    }
    
    return await api.get<PredictionResult[]>('/predictions/recent', { limit });
  }

  async deletePrediction(id: string): Promise<void> {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return;
    }
    
    await api.delete(`/predictions/${id}`);
  }

  async getDashboardStats(): Promise<DashboardStats> {
    if (MOCK_MODE) {
      const mockStats: DashboardStats = {
        totalPredictions: 12,
        averageYield: 3.45,
        lastPredictionDate: new Date().toISOString(),
        mostUsedCrop: 'Maize',
        trendData: [
          { date: '2024-01', yield: 3.2, crop: 'Maize' },
          { date: '2024-02', yield: 3.5, crop: 'Maize' },
          { date: '2024-03', yield: 3.8, crop: 'Maize' },
        ],
      };
      return mockStats;
    }
    
    return await api.get<DashboardStats>('/predictions/stats');
  }

  async exportPredictions(): Promise<Blob> {
    if (MOCK_MODE) {
      throw new Error('Export not available in mock mode');
    }
    
    const response = await api.get('/predictions/export', {
      responseType: 'blob',
    });
    return response as unknown as Blob;
  }
}

export default new PredictionService();