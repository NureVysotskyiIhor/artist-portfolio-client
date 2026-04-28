import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { registerSchema, type RegisterFormData } from '@/utils/validations-auth/register.utils';
import { useRegisterMutation } from '@/queries/auth.queries';
import { ApiError } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const { mutate: registerUser, isPending } = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const handleFormSubmit = (data: RegisterFormData) => {
    registerUser(data, {
      onSuccess: () => {
        toast.success('Registration successful! Please check your email to verify your account.');
        void navigate({ to: '/login' });
      },
      onError: error => {
        if (error instanceof ApiError && error.status === 400) {
          toast.error('Email already exists.');
        } else {
          toast.error('Something went wrong.', {
            description: 'Please try again later.',
          });
        }
      },
    });
  };
  return (
    <form onSubmit={e => void handleSubmit(handleFormSubmit)(e)} className='flex flex-col gap-6'>
      <div className='flex flex-col gap-2'>
        <Label
          htmlFor='register-name'
          className={cn(
            'text-base font-semibold',
            errors.name ? 'text-destructive' : 'text-foreground'
          )}
        >
          Name
        </Label>
        <div className='relative'>
          <Input
            id='register-name'
            type='text'
            placeholder='Your name'
            {...register('name')}
            className={cn(errors.name && 'border-destructive pr-11')}
          />
          {errors.name && (
            <AlertCircle
              size={18}
              className='absolute right-4 top-1/2 -translate-y-1/2 text-destructive'
            />
          )}
        </div>
        {errors.name && <p className='text-xs text-destructive'>{errors.name.message}</p>}
      </div>

      <div className='flex flex-col gap-2'>
        <Label
          htmlFor='register-email'
          className={cn(
            'text-base font-semibold',
            errors.email ? 'text-destructive' : 'text-foreground'
          )}
        >
          Email
        </Label>
        <div className='relative'>
          <Input
            id='register-email'
            type='email'
            placeholder='you@example.com'
            {...register('email')}
            className={cn(errors.email && 'border-destructive pr-11')}
          />
          {errors.email && (
            <AlertCircle
              size={18}
              className='absolute right-4 top-1/2 -translate-y-1/2 text-destructive'
            />
          )}
        </div>
        {errors.email && <p className='text-xs text-destructive'>{errors.email.message}</p>}
      </div>

      <div className='flex flex-col gap-2'>
        <Label
          htmlFor='register-password'
          className={cn(
            'text-base font-semibold',
            errors.password ? 'text-destructive' : 'text-foreground'
          )}
        >
          Password
        </Label>
        <div className='relative'>
          <Input
            id='register-password'
            type={showPassword ? 'text' : 'password'}
            placeholder='••••••••'
            {...register('password')}
            className={cn(errors.password && 'border-destructive', 'pr-11')}
          />
          <button
            type='button'
            onClick={() => setShowPassword(prev => !prev)}
            className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground'
          >
            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>
        {errors.password && <p className='text-xs text-destructive'>{errors.password.message}</p>}
      </div>

      <div className='flex flex-col gap-2'>
        <Label
          htmlFor='register-confirm'
          className={cn(
            'text-base font-semibold',
            errors.confirmPassword ? 'text-destructive' : 'text-foreground'
          )}
        >
          Confirm password
        </Label>
        <div className='relative'>
          <Input
            id='register-confirm'
            type={showConfirm ? 'text' : 'password'}
            placeholder='••••••••'
            {...register('confirmPassword')}
            className={cn(errors.confirmPassword && 'border-destructive', 'pr-11')}
          />
          <button
            type='button'
            onClick={() => setShowConfirm(prev => !prev)}
            className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground'
          >
            {showConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className='text-xs text-destructive'>{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type='submit' disabled={isPending} variant='brand' className='mt-1'>
        {isPending ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  );
};
