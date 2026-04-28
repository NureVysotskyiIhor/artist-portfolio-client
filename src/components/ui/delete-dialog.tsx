import { Button } from '@/components/ui/button';

interface DeleteDialogProps {
  title: string;
  description: string;
  onConfirm: () => void;
  onClose: () => void;
  isPending?: boolean;
}

export const DeleteDialog = ({
  title,
  description,
  onConfirm,
  onClose,
  isPending = false,
}: DeleteDialogProps) => {
  return (
    <div className='flex flex-col gap-4'>
      <p className='text-sm text-foreground/70'>{description}</p>
      <div className='flex gap-3'>
        <Button variant='destructive' onClick={onConfirm} disabled={isPending}>
          {isPending ? 'Deleting...' : title}
        </Button>
        <Button type='button' variant='outline' onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
