import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserProfileByIdQuery } from '@/queries/users.queries';
import { useCommissionTopicByIdQuery } from '@/queries/commission-topic.queries';
import type { CommissionRequestResponse } from '@/types/commission-request.types';
import { CommissionRequestStatus } from '@/types/enums/commission-status.enums';

const statusColors: Record<CommissionRequestStatus, string> = {
  [CommissionRequestStatus.PENDING]: 'bg-yellow-100 text-yellow-700',
  [CommissionRequestStatus.ACCEPTED]: 'bg-blue-100 text-blue-700',
  [CommissionRequestStatus.REJECTED]: 'bg-red-100 text-red-700',
  [CommissionRequestStatus.IN_PROGRESS]: 'bg-brand-green-muted text-brand-green',
  [CommissionRequestStatus.ON_REVIEW]: 'bg-purple-100 text-purple-700',
  [CommissionRequestStatus.COMPLETED]: 'bg-green-100 text-green-700',
  [CommissionRequestStatus.CANCELLED]: 'bg-gray-100 text-gray-500',
  [CommissionRequestStatus.EXPIRED]: 'bg-gray-100 text-gray-400',
};

interface CommissionRequestCardProps {
  request: CommissionRequestResponse;
  isArtist: boolean;
  onEdit: (request: CommissionRequestResponse) => void;
  onDelete?: (request: CommissionRequestResponse) => void;
}

export const CommissionRequestCard = ({
  request,
  isArtist,
  onEdit,
  onDelete,
}: CommissionRequestCardProps) => {
  const { data: user } = useUserProfileByIdQuery(request.userId);
  const { data: topic } = useCommissionTopicByIdQuery(request.topicId);

  return (
    <div className='rounded-2xl border border-border bg-white p-5 shadow-sm flex flex-col gap-4'>
      <div className='flex items-start justify-between gap-3'>
        <div className='flex items-center gap-3'>
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className='w-9 h-9 rounded-full object-cover border border-border shrink-0'
            />
          ) : (
            <div className='w-9 h-9 rounded-full bg-brand-green-muted flex items-center justify-center shrink-0'>
              <span className='text-sm font-bold text-brand-green'>
                {user?.name?.charAt(0).toUpperCase() ?? '?'}
              </span>
            </div>
          )}
          <div>
            <p className='text-sm font-semibold text-foreground'>{user?.name ?? '...'}</p>
            <p className='text-xs text-muted-foreground'>
              {new Date(request.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0 ${statusColors[request.status]}`}
        >
          {request.status.replace('_', ' ')}
        </span>
      </div>

      <div>
        <p className='text-sm font-semibold text-foreground mb-1'>{request.title}</p>
        <p className='text-xs text-muted-foreground leading-relaxed line-clamp-3'>
          {request.description}
        </p>
      </div>

      {topic ? (
        <div className='flex items-center gap-1.5 text-xs font-medium text-brand-green'>
          <span>{topic.icon}</span>
          <span>{topic.name}</span>
        </div>
      ) : request.topicName ? (
        <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
          <span>{request.topicName}</span>
          <span className='rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider'>
            deleted
          </span>
        </div>
      ) : null}

      <div className='flex flex-wrap gap-4 text-xs text-muted-foreground'>
        <span>
          💰 ${request.budgetMin} — ${request.budgetMax}
        </span>
        <span>
          📅{' '}
          {new Date(request.deadline).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </span>
        {request.city && <span>📍 {request.city}</span>}
      </div>

      {(request.contacts.telegram || request.contacts.instagram || request.contacts.whatsapp) && (
        <div className='flex flex-wrap gap-3 text-xs'>
          {request.contacts.telegram && (
            <span className='text-brand-green'>TG: {request.contacts.telegram}</span>
          )}
          {request.contacts.instagram && (
            <span className='text-brand-green'>IG: {request.contacts.instagram}</span>
          )}
          {request.contacts.whatsapp && (
            <span className='text-muted-foreground'>WA: {request.contacts.whatsapp}</span>
          )}
        </div>
      )}

      {isArtist && request.artistNote && (
        <div className='rounded-xl bg-brand-green-muted px-4 py-3'>
          <p className='text-[10px] font-bold uppercase tracking-wider text-brand-green mb-1'>
            Artist note
          </p>
          <p className='text-xs text-foreground/70'>{request.artistNote}</p>
        </div>
      )}

      <div className='flex items-center justify-between pt-1'>
        <p className='text-[10px] text-muted-foreground'>
          Updated{' '}
          {new Date(request.updatedAt).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </p>
        <div className='flex gap-2'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => onEdit(request)}
            className='text-muted-foreground hover:text-brand-green hover:bg-brand-green-muted'
          >
            <Pencil className='w-4 h-4' />
          </Button>
          {!isArtist && onDelete && (
            <Button
              variant='ghost'
              size='icon'
              onClick={() => onDelete(request)}
              className='text-muted-foreground hover:text-destructive hover:bg-destructive/10'
            >
              <Trash2 className='w-4 h-4' />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
