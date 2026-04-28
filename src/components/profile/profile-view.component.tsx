import type { UserResponse } from '@/types/user.types';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

interface ProfileViewProps {
  user: UserResponse;
  onEdit: () => void;
}

export const ProfileView = ({ user, onEdit }: ProfileViewProps) => {
  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-start justify-between'>
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className='w-20 h-20 rounded-full object-cover border border-border'
          />
        ) : (
          <div className='w-20 h-20 rounded-full bg-brand-green-muted flex items-center justify-center'>
            <span className='text-2xl font-bold text-brand-green'>
              {user.name?.charAt(0).toUpperCase() ?? '?'}
            </span>
          </div>
        )}
        <Button onClick={onEdit} variant='brand-outline'>
          <Pencil className='w-4 h-4' />
          Edit
        </Button>
      </div>

      <div className='flex flex-col gap-4'>
        <div>
          <p className='text-xs font-bold text-foreground/50 uppercase tracking-wider mb-1'>Name</p>
          <p className='text-sm text-foreground'>{user.name || '—'}</p>
        </div>

        <div>
          <p className='text-xs font-bold text-foreground/50 uppercase tracking-wider mb-1'>
            Email
          </p>
          <p className='text-sm text-foreground'>{user.email}</p>
        </div>

        <div>
          <p className='text-xs font-bold text-foreground/50 uppercase tracking-wider mb-1'>Bio</p>
          <p className='text-sm text-foreground'>{user.bio || '—'}</p>
        </div>

        <div>
          <p className='text-xs font-bold text-foreground/50 uppercase tracking-wider mb-1'>
            Member since
          </p>
          <p className='text-sm text-foreground'>
            {new Date(user.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>
    </div>
  );
};
