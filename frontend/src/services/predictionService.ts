import api from './api';
import {
  PredictionInput,
  PredictionResult,
  PredictionHistory,
  DashboardStats,
} from '../types';

class PredictionService {
  async createPrediction(input: PredictionInput): Promise<PredictionResult> {
    return await api.post<PredictionResult>('/predictions', input);
  }

  async getPredictionById(id: string): Promise<PredictionResult> {
    return await api.get<PredictionResult>(`/predictions/${id}`);
  }

  async getPredictionHistory(
    page: number = 1,
    limit: number = 10
  ): Promise<PredictionHistory> {
    return await api.get<PredictionHistory>('/predictions/history', {
      page,
      limit,
    });
  }

  async getRecentPredictions(limit: number = 5): Promise<PredictionResult[]> {
    return await api.get<PredictionResult[]>('/predictions/recent', { limit });
  }

  async deletePrediction(id: string): Promise<void> {
    await api.delete(`/predictions/${id}`);
  }

  async getDashboardStats(): Promise<DashboardStats> {
    return await api.get<DashboardStats>('/predictions/stats');
  }

  async exportPredictions(): Promise<Blob> {
    const response = await api.get('/predictions/export', {
      responseType: 'blob',
    });
    return response as unknown as Blob;
  }
}

export default new PredictionService();