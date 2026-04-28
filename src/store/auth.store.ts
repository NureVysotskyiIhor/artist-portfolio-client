import { create } from 'zustand';
import { queryClient } from '@/lib/query-client';

interface AuthState {
  token: string | null;
  isArtist: boolean;
  setToken: (token: string, isArtist: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  token: localStorage.getItem('token'),
  isArtist: localStorage.getItem('isArtist') === 'true',
  setToken: (token, isArtist) => {
    localStorage.setItem('token', token);
    localStorage.setItem('isArtist', String(isArtist));
    set({ token, isArtist });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isArtist');
    set({ token: null, isArtist: false });
    queryClient.clear();
  },
}));
