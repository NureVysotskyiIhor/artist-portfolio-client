import { z } from 'zod';

export const homepageCreateSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  contacts: z.object({
    telegram: z.string().optional().default(''),
    instagram: z.string().optional().default(''),
    whatsapp: z.string().optional().default(''),
  }),
});

export type HomepageCreateFormInput = z.input<typeof homepageCreateSchema>;
