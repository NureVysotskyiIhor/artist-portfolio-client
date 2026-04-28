import CommissionTopicsPage from '@/pages/commission-topics.page';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/topics')({
  component: CommissionTopicsPage,
});
