import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import authService from '../services/authService';
import { LoginCredentials, SignUpData } from '../types';
import { ROUTES } from '../utils/constants';

export const useAuth = () => {
  const navigate = useNavigate();
  const { user, isLoading, error, isAuthenticated, setUser, setLoading, setError, clearAuth } = useAuthStore();

  const signIn = useCallback(async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.signIn(credentials);
      setUser(response.user);
      navigate(ROUTES.DASHBOARD);
    } catch (err: any) {
      setError(err.message || 'Sign in failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [navigate, setUser, setLoading, setError]);

  const signUp = useCallback(async (data: SignUpData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.signUp(data);
      setUser(response.user);
      navigate(ROUTES.DASHBOARD);
    } catch (err: any) {
      setError(err.message || 'Sign up failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [navigate, setUser, setLoading, setError]);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      await authService.signOut();
      clearAuth();
      navigate(ROUTES.HOME);
    } catch (err: any) {
      console.error('Sign out error:', err);
    } finally {
      setLoading(false);
    }
  }, [navigate, clearAuth, setLoading]);

  const refreshUser = useCallback(async () => {
    try {
      setLoading(true);
      const user = await authService.getCurrentUser();
      setUser(user);
    } catch (err: any) {
      setError(err.message);
      clearAuth();
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading, setError, clearAuth]);

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    refreshUser,
  };
};