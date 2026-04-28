import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  profileEditSchema,
  type ProfileEditFormInput,
} from '@/utils/validations-profile/profile-edit.utils';
import { useUpdateUserProfileMutation } from '@/queries/users.queries';
import { ApiError } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import type { UserResponse } from '@/types/user.types';

interface ProfileEditProps {
  user: UserResponse;
  onCancel: () => void;
}

export const ProfileEdit = ({ user, onCancel }: ProfileEditProps) => {
  const { mutate: updateUser, isPending } = useUpdateUserProfileMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileEditFormInput>({
    resolver: zodResolver(profileEditSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name ?? '',
        bio: user.bio ?? '',
        avatarUrl: user.avatarUrl ?? '',
      });
    }
  }, [user, reset]);

  const handleFormSubmit = (data: ProfileEditFormInput) => {
    updateUser(
      {
        id: user.id,
        data: {
          name: data.name,
          bio: data.bio,
          avatarUrl: data.avatarUrl,
        },
      },
      {
        onSuccess: () => {
          toast.success('Profile updated successfully');
          onCancel();
        },
        onError: error => {
          if (error instanceof ApiError) {
            toast.error('Failed to update profile');
          }
        },
      }
    );
  };

  return (
    <form onSubmit={e => void handleSubmit(handleFormSubmit)(e)} className='flex flex-col gap-5'>
      <div className='flex flex-col gap-2'>
        <Label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
          Name *
        </Label>
        <Input
          {...register('name')}
          placeholder='Your name'
          className={cn(errors.name && 'border-destructive')}
        />
        {errors.name && <p className='text-xs text-destructive'>{errors.name.message}</p>}
      </div>

      <div className='flex flex-col gap-2'>
        <Label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>Bio</Label>
        <textarea
          {...register('bio')}
          rows={4}
          placeholder='Tell something about yourself...'
          className={cn(
            'w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-ring resize-none',
            errors.bio && 'border-destructive'
          )}
        />
      </div>

      <div className='flex flex-col gap-2'>
        <Label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
          Avatar URL
        </Label>
        <Input
          {...register('avatarUrl')}
          placeholder='https://example.com/avatar.jpg'
          className={cn(errors.avatarUrl && 'border-destructive')}
        />
        {errors.avatarUrl && <p className='text-xs text-destructive'>{errors.avatarUrl.message}</p>}
      </div>

      <div className='flex gap-3'>
        <Button
          type='submit'
          disabled={isPending}
          className='bg-brand-green text-white hover:bg-brand-green-hover'
        >
          {isPending ? 'Saving...' : 'Save changes'}
        </Button>
        <Button type='button' variant='outline' onClick={onCancel} className='gap-2'>
          <X className='w-4 h-4' />
          Cancel
        </Button>
      </div>
    </form>
  );
};
