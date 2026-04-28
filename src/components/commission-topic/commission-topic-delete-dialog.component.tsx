import { toast } from 'sonner';
import { useDeleteCommissionTopicMutation } from '@/queries/commission-topic.queries';
import { Button } from '@/components/ui/button';
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
    <div className='flex flex-col gap-4'>
      <p className='text-sm text-foreground/70'>
        Are you sure you want to delete{' '}
        <span className='font-semibold text-foreground'>{topic.name}</span>? This action cannot be
        undone.
      </p>
      <div className='flex gap-3'>
        <Button
          onClick={handleDelete}
          disabled={isPending}
          className='bg-destructive text-white hover:bg-destructive/90'
        >
          {isPending ? 'Deleting...' : 'Delete'}
        </Button>
        <Button type='button' variant='outline' onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
