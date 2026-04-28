import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { loginSchema, type LoginFormData } from '@/utils/validations-auth/login.utils';
import { useLoginMutation } from '@/queries/auth.queries';
import { ApiError } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { mutate: login, isPending } = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleFormSubmit = (data: LoginFormData) => {
    login(data, {
      onSuccess: () => {
        toast.success('Logged in successfully!');
        void navigate({ to: '/' });
      },
      onError: error => {
        if (error instanceof ApiError && error.status === 401) {
          toast.error('Invalid email or password. Please try again.');
        } else if (error instanceof ApiError && error.status === 403) {
          toast.error('Please verify your email before logging in.', {
            description: 'Check your inbox for a verification email.',
          });
        } else {
          toast.error('An unexpected error occurred. Please try again later.', {
            description: 'Check your inbox for a verification email.',
          });
        }
      },
    });
  };

  return (
    <form onSubmit={e => void handleSubmit(handleFormSubmit)(e)} className='flex flex-col gap-6'>
      <div className='flex flex-col gap-2'>
        <Label
          htmlFor='login-email'
          className={cn(
            'text-base font-semibold',
            errors.email ? 'text-destructive' : 'text-foreground'
          )}
        >
          Email
        </Label>
        <div className='relative'>
          <Input
            id='login-email'
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
          htmlFor='login-password'
          className={cn(
            'text-base font-semibold',
            errors.password ? 'text-destructive' : 'text-foreground'
          )}
        >
          Password
        </Label>
        <div className='relative'>
          <Input
            id='login-password'
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

      <Button
        type='submit'
        disabled={isPending}
        className='mt-1 bg-brand-green text-white hover:bg-brand-green-hover'
      >
        {isPending ? 'Logging in...' : 'Log in'}
      </Button>
    </form>
  );
};
