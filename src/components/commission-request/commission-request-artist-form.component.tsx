import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { commissionRequestArtistUpdateSchema, type CommissionRequestArtistUpdateFormInput } from '@/utils/validations-commission-request/commission-request-artist-update.utils'
import { useUpdateCommissionRequestArtistNoteMutation } from '@/queries/commission-request.queries'
import { useUserProfileQuery } from '@/queries/users.queries'
import { ApiError } from '@/api/client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { CommissionRequestStatus } from '@/types/enums/commission-status.enums'
import type { CommissionRequestResponse } from '@/types/commission-request.types'

const ARTIST_STATUSES = [
  CommissionRequestStatus.PENDING,
  CommissionRequestStatus.ACCEPTED,
  CommissionRequestStatus.REJECTED,
  CommissionRequestStatus.IN_PROGRESS,
  CommissionRequestStatus.ON_REVIEW,
  CommissionRequestStatus.COMPLETED,
]

interface CommissionRequestArtistFormProps {
  request: CommissionRequestResponse
  onClose: () => void
}

export const CommissionRequestArtistForm = ({ request, onClose }: CommissionRequestArtistFormProps) => {
  const { data: user } = useUserProfileQuery()
  const { mutate: updateArtistNote, isPending } = useUpdateCommissionRequestArtistNoteMutation()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CommissionRequestArtistUpdateFormInput>({
    resolver: zodResolver(commissionRequestArtistUpdateSchema),
  })

  useEffect(() => {
    if (request) {
      reset({
        artistNote: request.artistNote ?? '',
        status: request.status,
      })
    }
  }, [request, reset])

  const handleFormSubmit = (data: CommissionRequestArtistUpdateFormInput) => {
    if (!user) return
    updateArtistNote(
      {
        id: request.id,
        artistId: user.id,
        data: {
          artistNote: data.artistNote,
          status: data.status,
        },
      },
      {
        onSuccess: () => { toast.success('Request updated'); onClose() },
        onError: (error) => { if (error instanceof ApiError) toast.error('Failed to update request') },
      }
    )
  }

  return (
    <form
      onSubmit={e => void handleSubmit(handleFormSubmit)(e)}
      className="flex flex-col gap-5"
    >
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-bold text-foreground/50 uppercase tracking-wider">
          Status
        </Label>
        <select
          {...register('status')}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {ARTIST_STATUSES.map(status => (
            <option key={status} value={status}>
              {status.replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-xs font-bold text-foreground/50 uppercase tracking-wider">
          Artist Note *
        </Label>
        <textarea
          {...register('artistNote')}
          rows={4}
          placeholder="Leave a note for the client..."
          className={cn(
            'w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-ring resize-none',
            errors.artistNote && 'border-destructive'
          )}
        />
        {errors.artistNote && (
          <p className="text-xs text-destructive">{errors.artistNote.message}</p>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isPending} className="bg-brand-green text-white hover:bg-brand-green-hover">
          {isPending ? 'Saving...' : 'Save changes'}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </form>
  )
}