import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  homepageEditSchema,
  type HomepageEditFormInput,
} from '@/utils/validations-homepage/homepage-edit.utils';
import { useUpdateHomepageProfileMutation } from '@/queries/homepage-profile.queries';
import { ApiError } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { HomepageProfileResponse } from '@/types/homepage-profile.types';

interface HomepageEditProps {
  profile: HomepageProfileResponse;
}

export const HomepageEditForm = ({ profile }: HomepageEditProps) => {
  const { mutate: updateProfile, isPending } = useUpdateHomepageProfileMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HomepageEditFormInput>({
    resolver: zodResolver(homepageEditSchema),
  });

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        title: profile.title ?? '',
        bio: profile.bio ?? '',
        skills: profile.skills?.join(', ') ?? '',
        achievements: profile.achievements?.join(', ') ?? '',
        contacts: {
          telegram: profile.contacts?.telegram ?? '',
          instagram: profile.contacts?.instagram ?? '',
          whatsapp: profile.contacts?.whatsapp ?? '',
        },
      });
    }
  }, [profile, reset]);

  const handleFormSubmit = (data: HomepageEditFormInput) => {
    updateProfile(
      {
        name: data.name,
        title: data.title,
        bio: data.bio,
        skills: data.skills
          ? data.skills
              .split(',')
              .map(s => s.trim())
              .filter(Boolean)
          : [],
        achievements: data.achievements
          ? data.achievements
              .split(',')
              .map(a => a.trim())
              .filter(Boolean)
          : [],
        contacts: {
          telegram: data.contacts?.telegram ?? '',
          instagram: data.contacts?.instagram ?? '',
          whatsapp: data.contacts?.whatsapp ?? '',
        },
      },
      {
        onSuccess: () => toast.success('Profile updated successfully'),
        onError: error => {
          if (error instanceof ApiError) {
            toast.error('Failed to update profile');
          }
        },
      }
    );
  };

  return (
    <main className='max-w-2xl mx-auto px-4 py-10'>
      <div className='mb-8'>
        <p className='text-[11px] font-bold tracking-[.18em] uppercase text-brand-green mb-2'>
          Artist Portfolio
        </p>
        <h1 className='text-2xl font-bold font-playfair text-foreground mb-1.5'>
          Edit your portfolio
        </h1>
        <p className='text-sm text-foreground/50'>Update your public portfolio page</p>
      </div>

      <div className='bg-white rounded-3xl border-[1.5px] border-border p-8 shadow-sm'>
        <form
          onSubmit={e => void handleSubmit(handleFormSubmit)(e)}
          className='flex flex-col gap-5'
        >
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
            <Label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
              Title
            </Label>
            <Input
              {...register('title')}
              placeholder='e.g. Contemporary Artist'
              className={cn(errors.title && 'border-destructive')}
            />
            {errors.title && <p className='text-xs text-destructive'>{errors.title.message}</p>}
          </div>

          <div className='flex flex-col gap-2'>
            <Label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
              Bio
            </Label>
            <textarea
              {...register('bio')}
              rows={4}
              placeholder='Tell visitors about yourself...'
              className={cn(
                'w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
                'focus:outline-none focus:ring-2 focus:ring-ring resize-none',
                errors.bio && 'border-destructive'
              )}
            />
            {errors.bio && <p className='text-xs text-destructive'>{errors.bio.message}</p>}
          </div>

          <div className='flex flex-col gap-2'>
            <Label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
              Skills
            </Label>
            <Input {...register('skills')} placeholder='Oil painting, Watercolor, Sculpture' />
            <p className='text-xs text-muted-foreground'>Separate with commas</p>
          </div>

          <div className='flex flex-col gap-2'>
            <Label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
              Achievements
            </Label>
            <Input {...register('achievements')} placeholder='Exhibition 2023, Award winner' />
            <p className='text-xs text-muted-foreground'>Separate with commas</p>
          </div>

          <div className='flex flex-col gap-2'>
            <p className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
              Contacts
            </p>
            <div className='flex flex-col gap-3'>
              {(['telegram', 'instagram', 'whatsapp'] as const).map(contact => (
                <div key={contact} className='flex flex-col gap-1'>
                  <Label className='text-xs capitalize text-muted-foreground'>{contact}</Label>
                  <Input {...register(`contacts.${contact}`)} placeholder={`@${contact}`} />
                </div>
              ))}
            </div>
          </div>

          <Button
            type='submit'
            disabled={isPending}
            className='bg-brand-green text-white hover:bg-brand-green-hover'
          >
            {isPending ? 'Saving...' : 'Save changes'}
          </Button>
        </form>
      </div>
    </main>
  );
};
