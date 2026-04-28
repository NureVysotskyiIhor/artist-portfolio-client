import PaintingsPage from '@/pages/paintings.page';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/paintings')({
  component: PaintingsPage,
});
