import { z } from 'zod'
import { CommissionRequestStatus } from '@/types/enums/commission-status.enums'

export const commissionRequestArtistUpdateSchema = z.object({
  artistNote: z.string().min(1, { message: 'Artist note is required' }),
  status: z.nativeEnum(CommissionRequestStatus),
})

export type CommissionRequestArtistUpdateFormInput = z.input<typeof commissionRequestArtistUpdateSchema>