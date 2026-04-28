import { PaintingStatus } from '@/types/enums/painting.enums';

export const paintingStatusColors: Record<PaintingStatus, string> = {
  [PaintingStatus.FOR_SALE]: 'bg-brand-green-muted text-brand-green',
  [PaintingStatus.SOLD]: 'bg-gray-100 text-gray-500',
  [PaintingStatus.NOT_FOR_SALE]: 'bg-yellow-100 text-yellow-700',
};

export const paintingStatusLabels: Record<PaintingStatus, string> = {
  [PaintingStatus.FOR_SALE]: 'For Sale',
  [PaintingStatus.SOLD]: 'Sold',
  [PaintingStatus.NOT_FOR_SALE]: 'Not for Sale',
};
