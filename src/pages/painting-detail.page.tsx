import { useState } from 'react';
import { useParams } from '@tanstack/react-router';
import { X, Pencil, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { usePaintingsByIdQuery } from '@/queries/paintings.queries';
import { PaintingForm } from '@/components/painting/painting-form.component';
import { PaintingDeleteDialog } from '@/components/painting/painting-delete-dialog.component';
import { Button } from '@/components/ui/button';
import { EyebrowLabel } from '@/components/ui/eyebrow-label';
import { paintingStatusColors, paintingStatusLabels } from '@/utils/painting-status.utils';

type OverlayState = { type: 'none' } | { type: 'edit' } | { type: 'delete' };

const PaintingDetailPage = () => {
  const { paintingId } = useParams({ from: '/painting-detail/$paintingId' });
  const { isArtist } = useAuthStore();
  const [overlay, setOverlay] = useState<OverlayState>({ type: 'none' });
  const { data: painting, isLoading } = usePaintingsByIdQuery(paintingId);

  const handleClose = () => setOverlay({ type: 'none' });

  if (isLoading) {
    return (
      <div className='flex min-h-[calc(100vh-57px)] items-center justify-center'>
        <p className='text-sm text-muted-foreground'>Loading...</p>
      </div>
    );
  }

  if (!painting) return null;

  return (
    <main className='max-w-4xl mx-auto px-4 py-10'>
      <div className='grid md:grid-cols-2 gap-8'>
        <div className='aspect-square rounded-3xl overflow-hidden bg-muted border border-border'>
          {painting.imageUrl ? (
            <img
              src={painting.imageUrl}
              alt={painting.title}
              className='w-full h-full object-cover'
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center'>
              <span className='text-6xl'>🎨</span>
            </div>
          )}
        </div>

        <div className='flex flex-col gap-5'>
          <div>
            <EyebrowLabel>Painting</EyebrowLabel>
            <h1 className='text-2xl font-bold font-playfair text-foreground mb-2'>
              {painting.title}
            </h1>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${paintingStatusColors[painting.status]}`}
            >
              {paintingStatusLabels[painting.status]}
            </span>
          </div>

          <p className='text-sm text-foreground/70 leading-relaxed'>{painting.description}</p>

          <div className='flex items-center justify-between py-4 border-t border-border'>
            <p className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>Price</p>
            <p className='text-2xl font-bold text-brand-green'>${painting.price}</p>
          </div>

          <div className='flex items-center justify-between py-4 border-t border-border'>
            <p className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>Added</p>
            <p className='text-sm text-foreground'>
              {new Date(painting.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>

          {isArtist && (
            <div className='flex gap-3 pt-2'>
              <Button
                onClick={() => setOverlay({ type: 'edit' })}
                variant='brand-outline'
                className='flex-1'
              >
                <Pencil className='w-4 h-4' />
                Edit
              </Button>
              <Button
                onClick={() => setOverlay({ type: 'delete' })}
                variant='outline'
                className='gap-2 border-destructive text-destructive hover:bg-destructive/10'
              >
                <Trash2 className='w-4 h-4' />
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>

      {overlay.type !== 'none' && (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
          <div className='absolute inset-0 bg-black/40 backdrop-blur-sm' onClick={handleClose} />
          <div className='relative z-10 w-full max-w-md mx-4 bg-white rounded-3xl border border-border p-8 shadow-xl max-h-[90vh] overflow-y-auto'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-lg font-bold font-playfair text-foreground'>
                {overlay.type === 'edit' ? 'Edit Painting' : 'Delete Painting'}
              </h2>
              <button
                onClick={handleClose}
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                <X className='w-5 h-5' />
              </button>
            </div>
            {overlay.type === 'edit' && <PaintingForm painting={painting} onClose={handleClose} />}
            {overlay.type === 'delete' && (
              <PaintingDeleteDialog painting={painting} onClose={handleClose} />
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default PaintingDetailPage;
