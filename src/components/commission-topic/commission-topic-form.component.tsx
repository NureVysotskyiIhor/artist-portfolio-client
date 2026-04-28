import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  commissionTopicSchema,
  type CommissionTopicFormInput,
} from '@/utils/validations-commission-topic/commission-topic.utils';
import {
  useCreateCommissionTopicMutation,
  useUpdateCommissionTopicMutation,
} from '@/queries/commission-topic.queries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CommissionTopicResponse } from '@/types/commission-topic.types';

interface CommissionTopicFormProps {
  topic?: CommissionTopicResponse;
  onClose: () => void;
}

export const CommissionTopicForm = ({ topic, onClose }: CommissionTopicFormProps) => {
  const isEditing = !!topic;
  const { mutate: createTopic, isPending: isCreating } = useCreateCommissionTopicMutation();
  const { mutate: updateTopic, isPending: isUpdating } = useUpdateCommissionTopicMutation();
  const isPending = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommissionTopicFormInput>({
    resolver: zodResolver(commissionTopicSchema),
  });

  useEffect(() => {
    if (topic) {
      reset({
        name: topic.name,
        description: topic.description ?? '',
        icon: topic.icon ?? '',
        isActive: topic.isActive,
      });
    }
  }, [topic, reset]);

  const handleFormSubmit = (data: CommissionTopicFormInput) => {
    if (isEditing) {
      updateTopic(
        {
          id: topic.id,
          data: {
            name: data.name,
            description: data.description,
            icon: data.icon,
            isActive: data.isActive,
          },
        },
        {
          onSuccess: () => {
            toast.success('Topic updated successfully!');
          },
        }
      );
    } else {
      createTopic(
        {
          name: data.name,
          description: data.description ?? '',
          icon: data.icon ?? '',
          isActive: data.isActive ?? true,
        },
        {
          onSuccess: () => {
            toast.success('Topic created successfully!');
            reset();
          },
        }
      );
    }
  };

  return (
    <form onSubmit={e => void handleSubmit(handleFormSubmit)(e)} className='flex flex-col gap-5'>
      <div className='flex flex-col gap-2'>
        <Label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
          Name *
        </Label>
        <Input
          {...register('name')}
          placeholder='e.g. Portrait'
          className={cn(errors.name && 'border-destructive')}
        />
        {errors.name && <p className='text-xs text-destructive'>{errors.name.message}</p>}
      </div>

      <div className='flex flex-col gap-2'>
        <Label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
          Description *
        </Label>
        <textarea
          {...register('description')}
          rows={3}
          placeholder='Describe this commission type...'
          className={cn(
            'w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-ring resize-none',
            errors.description && 'border-destructive'
          )}
        />
        {errors.description && (
          <p className='text-xs text-destructive'>{errors.description.message}</p>
        )}
      </div>

      <div className='flex flex-col gap-2'>
        <Label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
          Icon
        </Label>
        <Input {...register('icon')} placeholder='e.g. 🎨' />
      </div>

      <div className='flex items-center gap-2'>
        <input
          type='checkbox'
          id='isActive'
          {...register('isActive')}
          className='w-4 h-4 accent-brand-green'
        />
        <Label htmlFor='isActive' className='text-sm text-foreground cursor-pointer'>
          Active
        </Label>
      </div>

      <div className='flex gap-3 pt-2'>
        <Button
          type='submit'
          disabled={isPending}
          className='bg-brand-green text-white hover:bg-brand-green-hover'
        >
          {isPending ? 'Saving...' : isEditing ? 'Save changes' : 'Create topic'}
        </Button>
        <Button type='button' variant='outline' onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
