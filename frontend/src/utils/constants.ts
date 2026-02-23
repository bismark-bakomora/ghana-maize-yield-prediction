export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

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
  PREDICTIONS: 'predictions',
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

export const HISTORICAL_YIELD_TRENDS = [
  { year: 2011, yield: 1.8 },
  { year: 2012, yield: 1.9 },
  { year: 2013, yield: 2.0 },
  { year: 2014, yield: 2.1 },
  { year: 2015, yield: 2.2 },
  { year: 2016, yield: 2.0 },
  { year: 2017, yield: 2.3 },
  { year: 2018, yield: 2.4 },
  { year: 2019, yield: 2.5 },
  { year: 2020, yield: 2.6 },
  { year: 2021, yield: 2.7 },
];

export const GHANA_DISTRICTS: string[] = [
  'Accra',
  'Kumasi',
  'Tamale',
  'Sunyani',
  'Cape Coast',
  'Ho',
  'Koforidua',
  'Wa',
  'Bolgatanga',
  'Techiman',
  'Yendi',
  'Savelugu',
  'Bawku',
  'Navrongo',
  'Ejura',
];


export const DEBOUNCE_DELAY = 300;
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB