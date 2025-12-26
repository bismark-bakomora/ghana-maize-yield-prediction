export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const CROP_TYPES = [
  { label: 'Rice', value: 'rice' },
  { label: 'Maize', value: 'maize' },
  { label: 'Wheat', value: 'wheat' },
  { label: 'Cotton', value: 'cotton' },
  { label: 'Soybean', value: 'soybean' },
  { label: 'Millet', value: 'millet' },
  { label: 'Sorghum', value: 'sorghum' },
  { label: 'Cassava', value: 'cassava' },
  { label: 'Yam', value: 'yam' },
  { label: 'Cocoa', value: 'cocoa' },
];

export const SOIL_TYPES = [
  { label: 'Sandy', value: 'sandy' },
  { label: 'Clay', value: 'clay' },
  { label: 'Loamy', value: 'loamy' },
  { label: 'Silt', value: 'silt' },
  { label: 'Peaty', value: 'peaty' },
  { label: 'Chalky', value: 'chalky' },
];

export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  PREDICTION: '/prediction',
  INSIGHTS: '/insights',
  PROFILE: '/profile',
  SIGN_IN: '/auth/signin',
  SIGN_UP: '/auth/signup',
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'cropPredict_auth_token',
  USER_DATA: 'cropPredict_user_data',
  THEME: 'cropPredict_theme',
};

export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  PHONE_REGEX: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
};

export const CHART_COLORS = {
  PRIMARY: '#10b981',
  SECONDARY: '#3b82f6',
  SUCCESS: '#22c55e',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  INFO: '#06b6d4',
};

export const DEBOUNCE_DELAY = 300;
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB