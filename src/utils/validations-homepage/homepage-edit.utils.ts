import { z } from 'zod';

export const homepageEditSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  title: z.string().optional().default(''),
  bio: z.string().optional().default(''),
  skills: z.string().optional().default(''),
  achievements: z.string().optional().default(''),
  contacts: z.object({
    telegram: z.string().optional().default(''),
    instagram: z.string().optional().default(''),
    whatsapp: z.string().optional().default(''),
  }),
});

export type HomepageEditFormInput = z.input<typeof homepageEditSchema>;
