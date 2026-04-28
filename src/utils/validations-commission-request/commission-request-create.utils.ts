import { z } from 'zod';
import { CommissionRequestStatus } from '@/types/enums/commission-status.enums';

export const commissionRequestCreateSchema = z
  .object({
    topicId: z.string().min(1, { message: 'Please select a topic' }),
    title: z.string().min(2, { message: 'Title must be at least 2 characters' }),
    description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
    budgetMin: z.number().min(0, { message: 'Budget min must be positive' }),
    budgetMax: z.number().min(0, { message: 'Budget max must be positive' }),
    deadline: z.string().min(1, { message: 'Deadline is required' }),
    contacts: z.object({
      telegram: z.string().optional().default(''),
      instagram: z.string().optional().default(''),
      whatsapp: z.string().optional().default(''),
    }),
    status: z.nativeEnum(CommissionRequestStatus).default(CommissionRequestStatus.PENDING),
    city: z.string().optional().default(''),
    longitude: z.number().optional(),
    latitude: z.number().optional(),
  })
  .refine(data => data.budgetMax >= data.budgetMin, {
    message: 'Max budget must be greater than or equal to min budget',
    path: ['budgetMax'],
  })
  .refine(
    data => {
      const minDeadline = new Date();
      minDeadline.setDate(minDeadline.getDate() + 7);
      minDeadline.setHours(0, 0, 0, 0);
      return new Date(data.deadline) >= minDeadline;
    },
    {
      message: 'Deadline must be at least 7 days from today',
      path: ['deadline'],
    }
  );

export type CommissionRequestCreateFormInput = z.input<typeof commissionRequestCreateSchema>;
//export type CommissionRequestCreateFormOutput = z.infer <typeof commissionRequestCreateSchema>
