import { create } from 'zustand';
import { PredictionResult, DashboardStats } from '../types';

interface PredictionState {
  currentPrediction: PredictionResult | null;
  recentPredictions: PredictionResult[];
  dashboardStats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setCurrentPrediction: (prediction: PredictionResult | null) => void;
  setRecentPredictions: (predictions: PredictionResult[]) => void;
  setDashboardStats: (stats: DashboardStats | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearPrediction: () => void;
}

export const usePredictionStore = create<PredictionState>((set) => ({
  currentPrediction: null,
  recentPredictions: [],
  dashboardStats: null,
  isLoading: false,
  error: null,

  setCurrentPrediction: (prediction) => set({ currentPrediction: prediction }),
  
  setRecentPredictions: (predictions) => set({ recentPredictions: predictions }),
  
  setDashboardStats: (stats) => set({ dashboardStats: stats }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  clearPrediction: () => set({ currentPrediction: null, error: null }),
}));