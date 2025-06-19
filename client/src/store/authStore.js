import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiClient from '../api/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      setToken: (token) => {
        set({ token });
        if (token) {
          get().fetchUser();
        } else {
          set({ user: null });
        }
      },
      fetchUser: async () => {
        try {
          const response = await apiClient.get('/users/me');
          set({ user: response.data.data });
        } catch (error) {
          console.error("Failed to fetch user. Logging out.", error);
          set({ user: null, token: null });
        }
      },
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);