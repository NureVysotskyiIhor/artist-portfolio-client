import PaintingDetailPage from '@/pages/painting-detail.page';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/painting-detail/$paintingId')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className='min-h-screen bg-brand-cream px-6'>
      <PaintingDetailPage />
    </div>
  );
}
