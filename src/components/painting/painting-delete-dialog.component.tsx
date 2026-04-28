import { toast } from 'sonner';
import { useDeletePaintingMutation } from '@/queries/paintings.queries';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import type { PaintingResponse } from '@/types/painting.types';

interface PaintingDeleteDialogProps {
  painting: PaintingResponse;
  onClose: () => void;
}

export const PaintingDeleteDialog = ({ painting, onClose }: PaintingDeleteDialogProps) => {
  const { mutate: deletePainting, isPending } = useDeletePaintingMutation();
  const navigate = useNavigate();

  const handleDelete = () => {
    deletePainting(painting.id, {
      onSuccess: () => {
        toast.success('Painting deleted');
        onClose();
        void navigate({ to: '/paintings' });
      },
      onError: () => toast.error('Failed to delete painting'),
    });
  };

  return (
    <div className='flex flex-col gap-4'>
      <p className='text-sm text-foreground/70'>
        Are you sure you want to delete{' '}
        <span className='font-semibold text-foreground'>{painting.title}</span>? This action cannot
        be undone.
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
