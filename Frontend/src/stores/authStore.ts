import { create } from 'zustand';
import { authAPI } from '../services/api';
import type { User, LoginCredentials } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  checkAuth: async () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const userData = await authAPI.getMe();
        set({ user: userData, isAuthenticated: true, isLoading: false });
      } catch (error) {
        authAPI.logout();
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } else {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (credentials: LoginCredentials) => {
    const response = await authAPI.login(credentials);
    set({ user: response.user, isAuthenticated: true });
  },

  logout: () => {
    authAPI.logout();
    set({ user: null, isAuthenticated: false });
  },
}));
