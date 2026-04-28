import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useCommissionRequestsByUserIdQuery } from '@/queries/commission-request.queries';
import { useUserProfileQuery } from '@/queries/users.queries';
import { CommissionRequestCard } from '@/components/commission-request/commission-request-card.component';
import { CommissionRequestUserForm } from '@/components/commission-request/commission-request-user-form.component';
import { CommissionRequestDeleteDialog } from '@/components/commission-request/commission-request-delete-dialog.component';
import { Button } from '@/components/ui/button';
import type { CommissionRequestResponse } from '@/types/commission-request.types';

type OverlayState =
  | { type: 'none' }
  | { type: 'create' }
  | { type: 'edit'; request: CommissionRequestResponse }
  | { type: 'delete'; request: CommissionRequestResponse };

const CommissionRequestsUserPage = () => {
  const [overlay, setOverlay] = useState<OverlayState>({ type: 'none' });
  const { data: user } = useUserProfileQuery();
  const { data: requests = [], isLoading } = useCommissionRequestsByUserIdQuery(user?.id ?? '');

  const handleClose = () => setOverlay({ type: 'none' });

  if (isLoading) {
    return (
      <div className='flex min-h-[calc(100vh-57px)] items-center justify-center'>
        <p className='text-sm text-muted-foreground'>Loading...</p>
      </div>
    );
  }

  return (
    <main className='max-w-3xl mx-auto px-4 py-10'>
      <div className='mb-8 flex items-center justify-between'>
        <div>
          <p className='text-[11px] font-bold tracking-[.18em] uppercase text-brand-green mb-2'>
            My Orders
          </p>
          <h1 className='text-2xl font-bold font-playfair text-foreground'>Commission Requests</h1>
        </div>
        <Button
          onClick={() => setOverlay({ type: 'create' })}
          className='gap-2 bg-brand-green text-white hover:bg-brand-green-hover'
        >
          <Plus className='w-4 h-4' />
          New request
        </Button>
      </div>

      {requests.length === 0 ? (
        <div className='flex items-center justify-center py-16'>
          <p className='text-sm text-muted-foreground'>No requests yet</p>
        </div>
      ) : (
        <div className='flex flex-col gap-4'>
          {requests.map(request => (
            <CommissionRequestCard
              key={request.id}
              request={request}
              isArtist={false}
              onEdit={r => setOverlay({ type: 'edit', request: r })}
              onDelete={r => setOverlay({ type: 'delete', request: r })}
            />
          ))}
        </div>
      )}

      {overlay.type !== 'none' && (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
          <div className='absolute inset-0 bg-black/40 backdrop-blur-sm' onClick={handleClose} />
          <div className='relative z-10 w-full max-w-md mx-4 bg-white rounded-3xl border border-border p-8 shadow-xl max-h-[90vh] overflow-y-auto'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-lg font-bold font-playfair text-foreground'>
                {overlay.type === 'create' && 'New Request'}
                {overlay.type === 'edit' && 'Edit Request'}
                {overlay.type === 'delete' && 'Delete Request'}
              </h2>
              <button
                onClick={handleClose}
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            {overlay.type === 'create' && <CommissionRequestUserForm onClose={handleClose} />}
            {overlay.type === 'edit' && (
              <CommissionRequestUserForm request={overlay.request} onClose={handleClose} />
            )}
            {overlay.type === 'delete' && (
              <CommissionRequestDeleteDialog request={overlay.request} onClose={handleClose} />
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default CommissionRequestsUserPage;
