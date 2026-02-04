import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import authService from '../services/authService';
import { LoginCredentials, SignUpData, User } from '../types';
import { ROUTES } from '../utils/constants';

export const useAuth = () => {
  const navigate = useNavigate();
  const {
    user,
    isLoading,
    error,
    isAuthenticated,
    setUser,
    setLoading,
    setError,
    clearAuth,
  } = useAuthStore();

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
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (err: any) {
      setError(err.message);
      clearAuth();
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading, setError, clearAuth]);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);
      return updatedUser;
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading, setError]);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    try {
      setLoading(true);
      setError(null);
      await authService.changePassword(currentPassword, newPassword);
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  return useMemo(() => ({
    user,
    isLoading,
    error,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    refreshUser,
    updateProfile,
    changePassword,
  }), [user, isLoading, error, isAuthenticated, signIn, signUp, signOut, refreshUser, updateProfile, changePassword]);
};
