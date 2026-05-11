import CommissionRequestsArtistPage from '@/pages/commission-requests-artist.page';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useAuthStore } from '@/store/auth.store';

export const Route = createFileRoute('/commission-request-artist')({
  beforeLoad: () => {
    const { token, isArtist } = useAuthStore.getState();
    if (!token) throw redirect({ to: '/login' });
    if (!isArtist) throw redirect({ to: '/' });
  },
  component: CommissionRequestsArtistPage,
});
