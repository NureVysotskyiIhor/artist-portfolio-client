import { z } from 'zod';
import { PaintingStatus } from '@/types/enums/painting.enums';

export const paintingCreateSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  imageUrl: z.string().url({ message: 'Invalid URL' }),
  price: z.number().min(0, { message: 'Price must be positive' }),
  status: z.nativeEnum(PaintingStatus).default(PaintingStatus.FOR_SALE),
  isPublic: z.boolean().default(false),
});

export type PaintingCreateFormInput = z.input<typeof paintingCreateSchema>;
