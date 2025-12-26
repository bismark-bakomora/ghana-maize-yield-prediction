import { create } from 'zustand';
import { User } from '../types';
import authService from '../services/authService';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  initialize: () => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  initialize: () => {
    const storedUser = authService.getStoredUser();
    const isAuthenticated = authService.isAuthenticated();
    set({ user: storedUser, isAuthenticated });
  },
  
  clearAuth: () => set({ user: null, isAuthenticated: false, error: null }),
}));