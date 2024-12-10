// store/authStore.ts
import { create } from 'zustand';

type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  login: (user: any) => void;
  logout: () => void;
  finishLoading: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true, // Começa como true para indicar o carregamento
  user: null,
  login: (user) => set({ isAuthenticated: true, user, isLoading: false }),
  logout: () => set({ isAuthenticated: false, user: null, isLoading: false }),
  finishLoading: () => set({ isLoading: false }), // Útil para controlar o final do carregamento
}));
