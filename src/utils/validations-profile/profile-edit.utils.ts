import { z } from 'zod'

export const profileEditSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  bio: z.string().optional().default(''),
  avatarUrl: z.string().url({ message: 'Invalid URL' }).optional().or(z.literal('')).default(''),
})

export type ProfileEditFormInput = z.input<typeof profileEditSchema>