// store/authStore.ts
import create from 'zustand';

interface AuthState {
    user: { id: string; nome: string; email: string; cargo: string } | null;
    setUser: (user: AuthState['user']) => void;
    isAuthenticated: boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    setUser: (user) => set({ user, isAuthenticated: !!user }),
    isAuthenticated: false,
}));
