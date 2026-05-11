import CommissionTopicsPage from '@/pages/commission-topics.page';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useAuthStore } from '@/store/auth.store';

export const Route = createFileRoute('/topics')({
  beforeLoad: () => {
    const { token, isArtist } = useAuthStore.getState();
    if (!token) throw redirect({ to: '/login' });
    if (!isArtist) throw redirect({ to: '/' });
  },
  component: CommissionTopicsPage,
});
