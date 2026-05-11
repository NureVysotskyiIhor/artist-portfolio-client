import FavoritesPage from '@/pages/favorites.page';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useAuthStore } from '@/store/auth.store';

export const Route = createFileRoute('/favorites')({
  beforeLoad: () => {
    const { token } = useAuthStore.getState();
    if (!token) throw redirect({ to: '/login' });
  },
  component: FavoritesPage,
});
