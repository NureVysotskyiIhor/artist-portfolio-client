import CommissionRequestsArtistPage from '@/pages/commission-requests-artist.page';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/commission-request-artist')({
  component: CommissionRequestsArtistPage,
});
