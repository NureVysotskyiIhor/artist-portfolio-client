import { toast } from 'sonner';
import { useDeletePaintingMutation } from '@/queries/paintings.queries';
import { DeleteDialog } from '@/components/ui/delete-dialog';
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
    <DeleteDialog
      title='Delete'
      description={`Are you sure you want to delete "${painting.title}"? This action cannot be undone.`}
      onConfirm={handleDelete}
      onClose={onClose}
      isPending={isPending}
    />
  );
};
