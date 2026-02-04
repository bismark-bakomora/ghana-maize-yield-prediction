import api from './api';
import { AuthResponse, LoginCredentials, SignUpData, User } from '../types';
import { STORAGE_KEYS } from '../utils/constants';

class AuthService {
  async signUp(data: SignUpData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/signup', data);
    this.setAuthData(response);
    return response;
  }

  async signIn(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/signin', credentials);
    this.setAuthData(response);
    return response;
  }

  async signOut(): Promise<void> {
    try {
      await api.post('/auth/signout');
    } finally {
      this.clearAuthData();
    }
  }

  async getCurrentUser(): Promise<User> {
    return await api.get<User>('/auth/me');
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const updatedUser = await api.put<User>('/auth/profile', data);
    // Update stored user data
    const currentUserData = this.getStoredUser();
    if (currentUserData) {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
    }
    return updatedUser;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  }

  private setAuthData(authResponse: AuthResponse): void {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authResponse.token);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(authResponse.user));
  }

  private clearAuthData(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }

  getStoredToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  getStoredUser(): User | null {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }
}

export default new AuthService();