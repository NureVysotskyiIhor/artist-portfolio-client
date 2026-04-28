import { useState } from 'react';
import { Plus, X, SlidersHorizontal } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { usePaintingsQuery, useFilteredPaintingsQuery } from '@/queries/paintings.queries';
import { useFavoritesWithPaintingQuery, useFavoriteStatsQuery } from '@/queries/favorites.queries';
import { PaintingCard } from '@/components/painting/painting-card.component';
import { PaintingForm } from '@/components/painting/painting-form.component';
import { Button } from '@/components/ui/button';
import { EyebrowLabel } from '@/components/ui/eyebrow-label';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PaintingStatus } from '@/types/enums/painting.enums';
import type { GetPaintingsParams } from '@/api/paintings.api';

type OverlayState = { type: 'none' } | { type: 'create' };

const PaintingsPage = () => {
  const { isArtist, token } = useAuthStore();
  const isAuthenticated = !!token;
  const [overlay, setOverlay] = useState<OverlayState>({ type: 'none' });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<GetPaintingsParams>({});
  const [priceMinInput, setPriceMinInput] = useState('');
  const [priceMaxInput, setPriceMaxInput] = useState('');
  const [statusInput, setStatusInput] = useState<PaintingStatus | ''>('');

  const isFiltered = Object.keys(filters).length > 0;
  const { data: allPaintings = [], isLoading: isLoadingAll } = usePaintingsQuery();
  const { data: filteredPaintings = [], isLoading: isLoadingFiltered } =
    useFilteredPaintingsQuery(filters);
  const { data: favorites = [] } = useFavoritesWithPaintingQuery();
  const { data: favoriteStats = [] } = useFavoriteStatsQuery();
  const isLoading = isFiltered ? isLoadingFiltered : isLoadingAll;
  const paintings = isFiltered ? filteredPaintings : allPaintings;
  const visiblePaintings = isArtist ? paintings : paintings.filter(p => p.isPublic);

  const handleApplyFilters = () => {
    const newFilters: GetPaintingsParams = {};
    if (statusInput) newFilters.status = statusInput;
    if (priceMinInput) newFilters.priceMin = parseFloat(priceMinInput);
    if (priceMaxInput) newFilters.priceMax = parseFloat(priceMaxInput);
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    setStatusInput('');
    setPriceMinInput('');
    setPriceMaxInput('');
  };

  const handleClose = () => setOverlay({ type: 'none' });

  if (isLoading) {
    return (
      <div className='flex min-h-[calc(100vh-57px)] items-center justify-center'>
        <p className='text-sm text-muted-foreground'>Loading...</p>
      </div>
    );
  }

  return (
    <main className='max-w-5xl mx-auto px-4 py-10'>
      <div className='mb-8 flex items-center justify-between'>
        <div>
          <EyebrowLabel>Gallery</EyebrowLabel>
          <h1 className='text-2xl font-bold font-playfair text-foreground'>Paintings</h1>
        </div>
        <div className='flex gap-2'>
          <Button variant='brand-outline' onClick={() => setShowFilters(prev => !prev)}>
            <SlidersHorizontal className='w-4 h-4' />
            Filters
          </Button>
          {isArtist && (
            <Button variant='brand' onClick={() => setOverlay({ type: 'create' })}>
              <Plus className='w-4 h-4' />
              Add painting
            </Button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className='bg-white rounded-3xl border border-border p-5 shadow-sm mb-6'>
          <p className='text-xs font-bold text-foreground/50 uppercase tracking-wider mb-3'>
            Filters
          </p>
          <div className='flex flex-wrap gap-4 items-end'>
            <div className='flex flex-col gap-2'>
              <Label className='text-xs text-muted-foreground'>Status</Label>
              <select
                value={statusInput}
                onChange={e => setStatusInput(e.target.value as PaintingStatus | '')}
                className='rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring'
              >
                <option value=''>All</option>
                <option value={PaintingStatus.FOR_SALE}>For Sale</option>
                <option value={PaintingStatus.SOLD}>Sold</option>
                <option value={PaintingStatus.NOT_FOR_SALE}>Not for Sale</option>
              </select>
            </div>
            <div className='flex flex-col gap-2'>
              <Label className='text-xs text-muted-foreground'>Min price</Label>
              <Input
                type='number'
                value={priceMinInput}
                onChange={e => setPriceMinInput(e.target.value)}
                placeholder='0'
                className='w-28'
              />
            </div>
            <div className='flex flex-col gap-2'>
              <Label className='text-xs text-muted-foreground'>Max price</Label>
              <Input
                type='number'
                value={priceMaxInput}
                onChange={e => setPriceMaxInput(e.target.value)}
                placeholder='0'
                className='w-28'
              />
            </div>
            <Button variant='brand' onClick={handleApplyFilters}>
              Apply
            </Button>
            {isFiltered && (
              <Button
                variant='ghost'
                onClick={handleClearFilters}
                className='gap-2 text-muted-foreground'
              >
                <X className='w-4 h-4' />
                Clear
              </Button>
            )}
          </div>
        </div>
      )}

      {visiblePaintings.length === 0 ? (
        <div className='flex items-center justify-center py-16'>
          <p className='text-sm text-muted-foreground'>No paintings yet</p>
        </div>
      ) : (
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {visiblePaintings.map(painting => (
            <PaintingCard
              key={painting.id}
              painting={painting}
              isArtist={isArtist}
              isAuthenticated={isAuthenticated}
              favorites={favorites}
              favoriteStats={favoriteStats.find(s => s.paintingId === painting.id)?.count || 0}
            />
          ))}
        </div>
      )}

      {overlay.type !== 'none' && (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
          <div className='absolute inset-0 bg-black/40 backdrop-blur-sm' onClick={handleClose} />
          <div className='relative z-10 w-full max-w-md mx-4 bg-white rounded-3xl border border-border p-8 shadow-xl max-h-[90vh] overflow-y-auto'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-lg font-bold font-playfair text-foreground'>Add Painting</h2>
              <button
                onClick={handleClose}
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                <X className='w-5 h-5' />
              </button>
            </div>
            <PaintingForm onClose={handleClose} />
          </div>
        </div>
      )}
    </main>
  );
};

export default PaintingsPage;
