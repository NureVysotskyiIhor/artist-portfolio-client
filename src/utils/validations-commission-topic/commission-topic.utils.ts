import { z } from 'zod';

export const commissionTopicSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  icon: z.string().optional().default(''),
  isActive: z.boolean().default(true),
});

export type CommissionTopicFormInput = z.input<typeof commissionTopicSchema>;
