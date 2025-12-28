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

// Prediction Types
export interface PredictionInput {
  rainfall: number;
  temperature: number;
  humidity: number;
  sunlight: number;
  soilMoisture: number;
  pestRisk: number;
  pfjPolicy: boolean;
  yieldLag1: number;
  growingDegreeDays: number;
  waterAvailability: number;
  climateStress: number;
  moistureTempRatio: number;
  rainfallPerSun: number;
  yearsSincePFJ: number;
}

export interface PredictionResult {
  id: string;
  userId: string;
  input: PredictionInput;
  predictedYield: number;
  confidence: number;
  recommendations: string[];
  createdAt: string;
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