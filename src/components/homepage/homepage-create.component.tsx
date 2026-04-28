import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  homepageCreateSchema,
  type HomepageCreateFormInput,
} from '@/utils/validations-homepage/homepage-create.utils';
import { useCreateHomepageProfileMutation } from '@/queries/homepage-profile.queries';
import { ApiError } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const HomepageCreateForm = () => {
  const { mutate: createProfile, isPending } = useCreateHomepageProfileMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HomepageCreateFormInput>({
    resolver: zodResolver(homepageCreateSchema),
  });

  const handleFormSubmit = (data: HomepageCreateFormInput) => {
    createProfile(
      {
        name: data.name,
        email: data.email,
        contacts: {
          telegram: data.contacts.telegram ?? '',
          instagram: data.contacts.instagram ?? '',
          whatsapp: data.contacts.whatsapp ?? '',
        },
      },
      {
        onSuccess: () => {
          toast.success('Homepage profile created successfully!');
        },
        onError: error => {
          if (error instanceof ApiError && error.status === 400) {
            toast.error('Invalid form data. Please check your inputs.');
          } else {
            toast.error('An error occurred while creating the homepage profile.');
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
          Set up your portfolio
        </h1>
        <p className='text-sm text-foreground/50'>
          Create your public portfolio page visible to all visitors
        </p>
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
              Email *
            </Label>
            <Input
              {...register('email')}
              type='email'
              placeholder='you@example.com'
              className={cn(errors.email && 'border-destructive')}
            />
            {errors.email && <p className='text-xs text-destructive'>{errors.email.message}</p>}
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
            {isPending ? 'Creating...' : 'Create portfolio'}
          </Button>
        </form>
      </div>
    </main>
  );
};
