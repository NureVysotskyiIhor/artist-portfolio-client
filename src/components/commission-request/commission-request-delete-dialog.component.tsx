import { toast } from 'sonner';
import { useDeleteCommissionRequestMutation } from '@/queries/commission-request.queries';
import { DeleteDialog } from '@/components/ui/delete-dialog';
import type { CommissionRequestResponse } from '@/types/commission-request.types';

interface CommissionRequestDeleteDialogProps {
  request: CommissionRequestResponse;
  onClose: () => void;
}

export const CommissionRequestDeleteDialog = ({
  request,
  onClose,
}: CommissionRequestDeleteDialogProps) => {
  const { mutate: deleteRequest, isPending } = useDeleteCommissionRequestMutation();

  const handleDelete = () => {
    deleteRequest(
      { id: request.id, userId: request.userId },
      {
        onSuccess: () => {
          toast.success('Request deleted');
          onClose();
        },
        onError: () => toast.error('Failed to delete request'),
      }
    );
  };

  return (
    <DeleteDialog
      title='Delete'
      description={`Are you sure you want to delete "${request.title}"? This action cannot be undone.`}
      onConfirm={handleDelete}
      onClose={onClose}
      isPending={isPending}
    />
  );
};
