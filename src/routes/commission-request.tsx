import CommissionRequestsUserPage from '@/pages/commission-requests-user.page'
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/commission-request')({
  component: CommissionRequestsUserPage,
})