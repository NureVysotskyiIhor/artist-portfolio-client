import { useState } from 'react';
import { X, MapPin, Loader2 } from 'lucide-react';
import {
  useCommissionRequestsQuery,
  useCommissionRequestsNearbyQuery,
} from '@/queries/commission-request.queries';
import { CommissionRequestCard } from '@/components/commission-request/commission-request-card.component';
import { CommissionRequestArtistForm } from '@/components/commission-request/commission-request-artist-form.component';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CommissionRequestResponse } from '@/types/commission-request.types';

type OverlayState = { type: 'none' } | { type: 'edit'; request: CommissionRequestResponse };

interface LocationFilter {
  latitude: number;
  longitude: number;
  radiusKm: number;
}

const CommissionRequestsArtistPage = () => {
  const [overlay, setOverlay] = useState<OverlayState>({ type: 'none' });
  const [locationFilter, setLocationFilter] = useState<LocationFilter | null>(null);
  const [radiusInput, setRadiusInput] = useState('50');
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const { data: allRequests = [], isLoading: isLoadingAll } = useCommissionRequestsQuery();
  const { data: nearbyRequests = [], isLoading: isLoadingNearby } =
    useCommissionRequestsNearbyQuery(locationFilter ?? { latitude: 0, longitude: 0, radiusKm: 0 });

  const isLoading = locationFilter ? isLoadingNearby : isLoadingAll;
  const requests = locationFilter ? nearbyRequests : allRequests;

  const handleClose = () => setOverlay({ type: 'none' });

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    const radius = parseFloat(radiusInput);
    if (isNaN(radius) || radius <= 0) {
      setLocationError('Please enter a valid radius');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      position => {
        setLocationFilter({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          radiusKm: radius,
        });
        setIsLocating(false);
      },
      error => {
        setLocationError('Failed to get your location. Please allow location access.');
        setIsLocating(false);
        console.error(error);
      }
    );
  };

  const handleClearFilter = () => {
    setLocationFilter(null);
    setLocationError(null);
  };

  if (isLoading) {
    return (
      <div className='flex min-h-[calc(100vh-57px)] items-center justify-center'>
        <p className='text-sm text-muted-foreground'>Loading...</p>
      </div>
    );
  }

  return (
    <main className='max-w-3xl mx-auto px-4 py-10'>
      <div className='mb-8'>
        <p className='text-[11px] font-bold tracking-[.18em] uppercase text-brand-green mb-2'>
          Management
        </p>
        <h1 className='text-2xl font-bold font-playfair text-foreground'>Commission Requests</h1>
      </div>

      <div className='bg-white rounded-3xl border border-border p-5 shadow-sm mb-6'>
        <p className='text-xs font-bold text-foreground/50 uppercase tracking-wider mb-3'>
          Filter by location
        </p>
        <div className='flex gap-3 items-end'>
          <div className='flex flex-col gap-2 w-32'>
            <Label className='text-xs text-muted-foreground'>Radius (km)</Label>
            <Input
              type='number'
              value={radiusInput}
              onChange={e => setRadiusInput(e.target.value)}
              placeholder='50'
              min='1'
            />
          </div>
          <Button
            onClick={handleLocate}
            disabled={isLocating}
            variant='outline'
            className='gap-2 border-brand-green text-brand-green hover:bg-brand-green-muted'
          >
            {isLocating ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              <MapPin className='w-4 h-4' />
            )}
            {isLocating ? 'Locating...' : 'Use my location'}
          </Button>
          {locationFilter && (
            <Button
              onClick={handleClearFilter}
              variant='ghost'
              className='gap-2 text-muted-foreground hover:text-foreground'
            >
              <X className='w-4 h-4' />
              Clear filter
            </Button>
          )}
        </div>
        {locationError && <p className='text-xs text-destructive mt-2'>{locationError}</p>}
        {locationFilter && (
          <p className='text-xs text-brand-green mt-2'>
            Showing requests within {locationFilter.radiusKm}km of your location
          </p>
        )}
      </div>

      {requests.length === 0 ? (
        <div className='flex items-center justify-center py-16'>
          <p className='text-sm text-muted-foreground'>
            {locationFilter ? 'No requests found nearby' : 'No requests yet'}
          </p>
        </div>
      ) : (
        <div className='flex flex-col gap-4'>
          {requests.map(request => (
            <CommissionRequestCard
              key={request.id}
              request={request}
              isArtist={true}
              onEdit={r => setOverlay({ type: 'edit', request: r })}
            />
          ))}
        </div>
      )}

      {overlay.type !== 'none' && (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
          <div className='absolute inset-0 bg-black/40 backdrop-blur-sm' onClick={handleClose} />
          <div className='relative z-10 w-full max-w-md mx-4 bg-white rounded-3xl border border-border p-8 shadow-xl max-h-[90vh] overflow-y-auto'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-lg font-bold font-playfair text-foreground'>Edit Request</h2>
              <button
                onClick={handleClose}
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                <X className='w-5 h-5' />
              </button>
            </div>
            <CommissionRequestArtistForm request={overlay.request} onClose={handleClose} />
          </div>
        </div>
      )}
    </main>
  );
};

export default CommissionRequestsArtistPage;
