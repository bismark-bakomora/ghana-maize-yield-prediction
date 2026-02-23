// User & Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  location?: string;
}

// Prediction Types - UPDATED to match backend
export interface PredictionInput {
  district: string;
  year: number;
  rainfall: number;
  temperature: number;
  humidity: number;
  sunlight: number;
  soilMoisture: number;
  pestRisk: number; // 0-100 in UI, converted to 0/1 for API
  pfjPolicy: boolean; // converted to 0/1 for API
  yieldLag1: number;
}

// Backend API request format
export interface PredictionApiRequest {
  district: string;
  year: number;
  rainfall: number;
  temperature: number;
  humidity: number;
  sunlight: number;
  soil_moisture: number;
  pest_risk: 0 | 1;
  pfj_policy: 0 | 1;
  yield_lag1: number;
}

// Backend API response format
export interface PredictionApiResponse {
  prediction: number;
  confidence_interval: {
    lower: number;
    upper: number;
  };
  risk_factors: string[];
  recommendations: string[];
  model_version: string;
  features_used?: number;
}

// Frontend display format
export interface PredictionResult {
  id: string;
  userId: string;
  input: PredictionInput;
  predictedYield: number;
  confidence: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  riskFactors: string[];
  recommendations: string[];
  modelVersion: string;
  createdAt: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface PredictionHistory {
  predictions: PredictionResult[];
  total: number;
  page: number;
  limit: number;
}

// Dashboard Types
export interface DashboardStats {
  totalPredictions: number;
  averageYield: number;
  lastPredictionDate?: string;
  mostUsedCrop: string;
  trendData: TrendDataPoint[];
}

export interface TrendDataPoint {
  date: string;
  yield: number;
  crop: string;
}

// Farm Insights Types
export interface FarmInsight {
  title: string;
  description: string;
  category: 'soil' | 'weather' | 'crop' | 'pest' | 'general';
  priority: 'low' | 'medium' | 'high';
  date: string;
}

// Common UI Types
export interface SelectOption {
  label: string;
  value: string;
}

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  success: boolean;
}

// Component Props Types
export interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  loading?: boolean;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}