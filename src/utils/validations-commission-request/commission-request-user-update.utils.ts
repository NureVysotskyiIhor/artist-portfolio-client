import { z } from 'zod'
import { CommissionRequestStatus } from '@/types/enums/commission-status.enums'

export const commissionRequestUserUpdateSchema = z.object({
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  budgetMin: z.number().min(0),
  budgetMax: z.number().min(0),
  deadline: z.string().min(1, { message: 'Deadline is required' }),
  contacts: z.object({
    telegram: z.string().optional().default(''),
    instagram: z.string().optional().default(''),
    whatsapp: z.string().optional().default(''),
  }),
  status: z.nativeEnum(CommissionRequestStatus),
}).refine(data => data.budgetMax >= data.budgetMin, {
  message: 'Max budget must be greater than or equal to min budget',
  path: ['budgetMax'],
}).refine(data => {
  const minDeadline = new Date()
  minDeadline.setDate(minDeadline.getDate() + 7)
  minDeadline.setHours(0, 0, 0, 0)
  return new Date(data.deadline) >= minDeadline
}, {
  message: 'Deadline must be at least 7 days from today',
  path: ['deadline'],
})

export type CommissionRequestUserUpdateFormInput = z.input<typeof commissionRequestUserUpdateSchema>
//export type CommissionRequestUserUpdateFormOutput = z.input<typeof commissionRequestUserUpdateSchema>