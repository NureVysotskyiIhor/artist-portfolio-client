import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  paintingCreateSchema,
  type PaintingCreateFormInput,
} from '@/utils/validations-painting/painting-create.utils';
import {
  paintingEditSchema,
  type PaintingEditFormInput,
} from '@/utils/validations-painting/painting-edit.utils';
import { useCreatePaintingMutation, useUpdatePaintingMutation } from '@/queries/paintings.queries';
import { ApiError } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PaintingStatus } from '@/types/enums/painting.enums';
import type { PaintingResponse } from '@/types/painting.types';

interface PaintingFormProps {
  painting?: PaintingResponse;
  onClose: () => void;
}

const PAINTING_STATUSES = [
  PaintingStatus.FOR_SALE,
  PaintingStatus.SOLD,
  PaintingStatus.NOT_FOR_SALE,
];

export const PaintingForm = ({ painting, onClose }: PaintingFormProps) => {
  const isEditing = !!painting;
  const { mutate: createPainting, isPending: isCreating } = useCreatePaintingMutation();
  const { mutate: updatePainting, isPending: isUpdating } = useUpdatePaintingMutation();
  const isPending = isCreating || isUpdating;

  const createForm = useForm<PaintingCreateFormInput>({
    resolver: zodResolver(paintingCreateSchema),
  });

  const editForm = useForm<PaintingEditFormInput>({
    resolver: zodResolver(paintingEditSchema),
  });

  useEffect(() => {
    if (painting) {
      editForm.reset({
        title: painting.title,
        description: painting.description,
        imageUrl: painting.imageUrl,
        price: painting.price,
        status: painting.status,
        isPublic: painting.isPublic,
      });
    }
  }, [painting, editForm]);

  const handleCreateSubmit = (data: PaintingCreateFormInput) => {
    createPainting(
      {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        price: data.price,
        status: data.status ?? PaintingStatus.FOR_SALE,
        isPublic: data.isPublic ?? false,
      },
      {
        onSuccess: () => {
          toast.success('Painting created');
          onClose();
        },
        onError: error => {
          if (error instanceof ApiError) toast.error('Failed to create painting');
        },
      }
    );
  };

  const handleEditSubmit = (data: PaintingEditFormInput) => {
    if (!painting) return;
    updatePainting(
      {
        id: painting.id,
        data: {
          title: data.title,
          description: data.description,
          imageUrl: data.imageUrl,
          price: data.price as number,
          status: data.status,
          isPublic: data.isPublic,
        },
      },
      {
        onSuccess: () => {
          toast.success('Painting updated');
          onClose();
        },
        onError: error => {
          if (error instanceof ApiError) toast.error('Failed to update painting');
        },
      }
    );
  };

  if (isEditing) {
    return (
      <form
        onSubmit={e => void editForm.handleSubmit(handleEditSubmit)(e)}
        className='flex flex-col gap-5'
      >
        <div className='flex flex-col gap-2'>
          <Label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
            Title *
          </Label>
          <Input
            {...editForm.register('title')}
            placeholder='e.g. Sunset over the mountains'
            className={cn(editForm.formState.errors.title && 'border-destructive')}
          />
          {editForm.formState.errors.title && (
            <p className='text-xs text-destructive'>{editForm.formState.errors.title.message}</p>
          )}
        </div>

        <div className='flex flex-col gap-2'>
          <Label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
            Description *
          </Label>
          <textarea
            {...editForm.register('description')}
            rows={3}
            placeholder='Describe your painting...'
            className={cn(
              'w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
              'focus:outline-none focus:ring-2 focus:ring-ring resize-none',
              editForm.formState.errors.description && 'border-destructive'
            )}
          />
          {editForm.formState.errors.description && (
            <p className='text-xs text-destructive'>
              {editForm.formState.errors.description.message}
            </p>
          )}
        </div>

        <div className='flex flex-col gap-2'>
          <Label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
            Image URL *
          </Label>
          <Input
            {...editForm.register('imageUrl')}
            placeholder='https://example.com/painting.jpg'
            className={cn(editForm.formState.errors.imageUrl && 'border-destructive')}
          />
          {editForm.formState.errors.imageUrl && (
            <p className='text-xs text-destructive'>{editForm.formState.errors.imageUrl.message}</p>
          )}
        </div>

        <div className='flex gap-3'>
          <div className='flex flex-col gap-2 flex-1'>
            <Label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
              Price *
            </Label>
            <div className='relative'>
              <span className='absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground'>
                $
              </span>
              <Input
                {...editForm.register('price', { valueAsNumber: true })}
                type='number'
                min={0}
                placeholder='0'
                className={cn('pl-7', editForm.formState.errors.price && 'border-destructive')}
              />
            </div>
          </div>
          <div className='flex flex-col gap-2 flex-1'>
            <Label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
              Status
            </Label>
            <select
              {...editForm.register('status')}
              className='w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring'
            >
              {PAINTING_STATUSES.map(s => (
                <option key={s} value={s}>
                  {s.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <input
            type='checkbox'
            id='isPublic'
            {...editForm.register('isPublic')}
            className='w-4 h-4 accent-brand-green'
          />
          <Label htmlFor='isPublic' className='text-sm text-foreground cursor-pointer'>
            Public
          </Label>
        </div>

        <div className='flex gap-3 pt-2'>
          <Button
            type='submit'
            disabled={isPending}
            className='bg-brand-green text-white hover:bg-brand-green-hover'
          >
            {isPending ? 'Saving...' : 'Save changes'}
          </Button>
          <Button type='button' variant='outline' onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form
      onSubmit={e => void createForm.handleSubmit(handleCreateSubmit)(e)}
      className='flex flex-col gap-5'
    >
      <div className='flex flex-col gap-2'>
        <Label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
          Title *
        </Label>
        <Input
          {...createForm.register('title')}
          placeholder='e.g. Sunset over the mountains'
          className={cn(createForm.formState.errors.title && 'border-destructive')}
        />
        {createForm.formState.errors.title && (
          <p className='text-xs text-destructive'>{createForm.formState.errors.title.message}</p>
        )}
      </div>

      <div className='flex flex-col gap-2'>
        <Label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
          Description *
        </Label>
        <textarea
          {...createForm.register('description')}
          rows={3}
          placeholder='Describe your painting...'
          className={cn(
            'w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-ring resize-none',
            createForm.formState.errors.description && 'border-destructive'
          )}
        />
        {createForm.formState.errors.description && (
          <p className='text-xs text-destructive'>
            {createForm.formState.errors.description.message}
          </p>
        )}
      </div>

      <div className='flex flex-col gap-2'>
        <Label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
          Image URL *
        </Label>
        <Input
          {...createForm.register('imageUrl')}
          placeholder='https://example.com/painting.jpg'
          className={cn(createForm.formState.errors.imageUrl && 'border-destructive')}
        />
        {createForm.formState.errors.imageUrl && (
          <p className='text-xs text-destructive'>{createForm.formState.errors.imageUrl.message}</p>
        )}
      </div>

      <div className='flex gap-3'>
        <div className='flex flex-col gap-2 flex-1'>
          <Label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
            Price *
          </Label>
          <div className='relative'>
            <span className='absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground'>
              $
            </span>
            <Input
              {...createForm.register('price', { valueAsNumber: true })}
              type='number'
              min={0}
              placeholder='0'
              className={cn('pl-7', createForm.formState.errors.price && 'border-destructive')}
            />
          </div>
        </div>
        <div className='flex flex-col gap-2 flex-1'>
          <Label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
            Status
          </Label>
          <select
            {...createForm.register('status')}
            className='w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring'
          >
            {PAINTING_STATUSES.map(s => (
              <option key={s} value={s}>
                {s.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className='flex items-center gap-2'>
        <input
          type='checkbox'
          id='isPublicCreate'
          {...createForm.register('isPublic')}
          className='w-4 h-4 accent-brand-green'
        />
        <Label htmlFor='isPublicCreate' className='text-sm text-foreground cursor-pointer'>
          Public
        </Label>
      </div>

      <div className='flex gap-3 pt-2'>
        <Button
          type='submit'
          disabled={isPending}
          className='bg-brand-green text-white hover:bg-brand-green-hover'
        >
          {isPending ? 'Saving...' : 'Add painting'}
        </Button>
        <Button type='button' variant='outline' onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
