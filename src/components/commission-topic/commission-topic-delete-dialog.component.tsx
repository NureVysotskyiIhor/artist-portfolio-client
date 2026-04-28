import { toast } from 'sonner';
import { useDeleteCommissionTopicMutation } from '@/queries/commission-topic.queries';
import { DeleteDialog } from '@/components/ui/delete-dialog';
import type { CommissionTopicResponse } from '@/types/commission-topic.types';

interface CommissionTopicDeleteDialogProps {
  topic: CommissionTopicResponse;
  onClose: () => void;
}

export const CommissionTopicDeleteDialog = ({
  topic,
  onClose,
}: CommissionTopicDeleteDialogProps) => {
  const { mutate: deleteTopic, isPending } = useDeleteCommissionTopicMutation();

  const handleDelete = () => {
    deleteTopic(topic.id, {
      onSuccess: () => {
        toast.success('Topic deleted successfully!');
        onClose();
      },
      onError: () => {
        toast.error('An error occurred while deleting the topic.');
      },
    });
  };

  return (
    <DeleteDialog
      title='Delete'
      description={`Are you sure you want to delete "${topic.name}"? This action cannot be undone.`}
      onConfirm={handleDelete}
      onClose={onClose}
      isPending={isPending}
    />
  );
};
