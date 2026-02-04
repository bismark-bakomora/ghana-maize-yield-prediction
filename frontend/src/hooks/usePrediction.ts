import { useCallback, useMemo } from 'react';
import { usePredictionStore } from '../store/predictionStore';
import predictionService from '../services/predictionService';
import { PredictionInput } from '../types';

export const usePrediction = () => {
  const {
    currentPrediction,
    recentPredictions,
    dashboardStats,
    isLoading,
    error,
    setCurrentPrediction,
    setRecentPredictions,
    setDashboardStats,
    setLoading,
    setError,
    clearPrediction,
  } = usePredictionStore();

  const createPrediction = useCallback(async (input: PredictionInput) => {
    try {
      setLoading(true);
      setError(null);
      const result = await predictionService.createPrediction(input);
      setCurrentPrediction(result);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to create prediction');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setCurrentPrediction, setLoading, setError]);

  const fetchRecentPredictions = useCallback(async (limit: number = 5) => {
    try {
      setLoading(true);
      const predictions = await predictionService.getRecentPredictions(limit);
      setRecentPredictions(predictions);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch recent predictions');
    } finally {
      setLoading(false);
    }
  }, [setRecentPredictions, setLoading, setError]);

  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      const stats = await predictionService.getDashboardStats();
      setDashboardStats(stats);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  }, [setDashboardStats, setLoading, setError]);

  const deletePrediction = useCallback(async (id: string) => {
    try {
      setLoading(true);
      // Optimistic update: remove prediction immediately
      setRecentPredictions(recentPredictions.filter(p => p.id !== id));
      await predictionService.deletePrediction(id);
    } catch (err: any) {
      setError(err.message || 'Failed to delete prediction');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [recentPredictions, setRecentPredictions, setLoading, setError]);

  return useMemo(() => ({
    currentPrediction,
    recentPredictions,
    dashboardStats,
    isLoading,
    error,
    createPrediction,
    fetchRecentPredictions,
    fetchDashboardStats,
    deletePrediction,
    clearPrediction,
  }), [
    currentPrediction,
    recentPredictions,
    dashboardStats,
    isLoading,
    error,
    createPrediction,
    fetchRecentPredictions,
    fetchDashboardStats,
    deletePrediction,
    clearPrediction
  ]);
};
