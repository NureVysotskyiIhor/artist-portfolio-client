import { toast } from 'sonner'
import { useDeleteCommissionRequestMutation } from '@/queries/commission-request.queries'
import { Button } from '@/components/ui/button'
import type { CommissionRequestResponse } from '@/types/commission-request.types'

interface CommissionRequestDeleteDialogProps {
  request: CommissionRequestResponse
  onClose: () => void
}

export const CommissionRequestDeleteDialog = ({ request, onClose }: CommissionRequestDeleteDialogProps) => {
  const { mutate: deleteRequest, isPending } = useDeleteCommissionRequestMutation()

  const handleDelete = () => {
    deleteRequest(
      { id: request.id, userId: request.userId },
      {
        onSuccess: () => { toast.success('Request deleted'); onClose() },
        onError: () => toast.error('Failed to delete request'),
      }
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-foreground/70">
        Are you sure you want to delete{' '}
        <span className="font-semibold text-foreground">{request.title}</span>?
        This action cannot be undone.
      </p>
      <div className="flex gap-3">
        <Button
          onClick={handleDelete}
          disabled={isPending}
          className="bg-destructive text-white hover:bg-destructive/90"
        >
          {isPending ? 'Deleting...' : 'Delete'}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </div>
  )
}