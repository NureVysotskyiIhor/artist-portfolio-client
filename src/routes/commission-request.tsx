import CommissionRequestsUserPage from '@/pages/commission-requests-user.page';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useAuthStore } from '@/store/auth.store';

export const Route = createFileRoute('/commission-request')({
  beforeLoad: () => {
    const { token } = useAuthStore.getState();
    if (!token) throw redirect({ to: '/login' });
  },
  component: CommissionRequestsUserPage,
});
