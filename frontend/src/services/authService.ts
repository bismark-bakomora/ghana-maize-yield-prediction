import api from './api';
import { AuthResponse, LoginCredentials, SignUpData, User } from '../types';
import { STORAGE_KEYS } from '../utils/constants';

// Mock mode for development (set to false when backend is ready)
const MOCK_MODE = true;

class AuthService {
  async signUp(data: SignUpData): Promise<AuthResponse> {
    if (MOCK_MODE) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: 'mock-user-' + Date.now(),
        email: data.email,
        name: data.name,
        phone: data.phone,
        location: data.location,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const mockToken = 'mock-token-' + Date.now();
      
      const response: AuthResponse = {
        user: mockUser,
        token: mockToken,
      };
      
      this.setAuthData(response);
      return response;
    }
    
    const response = await api.post<AuthResponse>('/auth/signup', data);
    this.setAuthData(response);
    return response;
  }

  async signIn(credentials: LoginCredentials): Promise<AuthResponse> {
    if (MOCK_MODE) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: 'mock-user-123',
        email: credentials.email,
        name: 'Mock User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const mockToken = 'mock-token-' + Date.now();
      
      const response: AuthResponse = {
        user: mockUser,
        token: mockToken,
      };
      
      this.setAuthData(response);
      return response;
    }
    
    const response = await api.post<AuthResponse>('/auth/signin', credentials);
    this.setAuthData(response);
    return response;
  }

  async signOut(): Promise<void> {
    if (MOCK_MODE) {
      this.clearAuthData();
      return;
    }
    
    try {
      await api.post('/auth/signout');
    } finally {
      this.clearAuthData();
    }
  }

  async getCurrentUser(): Promise<User> {
    if (MOCK_MODE) {
      const storedUser = this.getStoredUser();
      if (storedUser) return storedUser;
      throw new Error('Not authenticated');
    }
    
    return await api.get<User>('/auth/me');
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    if (MOCK_MODE) {
      const currentUser = this.getStoredUser();
      if (!currentUser) throw new Error('Not authenticated');
      
      const updatedUser = { ...currentUser, ...data };
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
      return updatedUser;
    }
    
    return await api.put<User>('/auth/profile', data);
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return;
    }
    
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