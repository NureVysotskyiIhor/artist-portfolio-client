import { z } from 'zod';
import { PaintingStatus } from '@/types/enums/painting.enums';

export const paintingEditSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters' }).optional(),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters' })
    .optional(),
  imageUrl: z.string().url({ message: 'Invalid URL' }).optional(),
  price: z.number().min(0, { message: 'Price must be positive' }).optional(),
  status: z.nativeEnum(PaintingStatus).optional(),
  isPublic: z.boolean().optional(),
});

export type PaintingEditFormInput = z.input<typeof paintingEditSchema>;
