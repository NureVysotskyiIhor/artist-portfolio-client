import { Link } from '@tanstack/react-router';
import { Heart } from 'lucide-react';
import { useFavoritesWithPaintingQuery } from '@/queries/favorites.queries';
import { useRemoveFavoriteMutation } from '@/queries/favorites.queries';
import { toast } from 'sonner';
import { EyebrowLabel } from '@/components/ui/eyebrow-label';
import { paintingStatusColors, paintingStatusLabels } from '@/utils/painting-status.utils';

const FavoritesPage = () => {
  const { data: favorites = [], isLoading } = useFavoritesWithPaintingQuery();
  const { mutate: removeFavorite } = useRemoveFavoriteMutation();

  const handleRemove = (paintingId: string) => {
    removeFavorite({ paintingId }, { onSuccess: () => toast.success('Removed from favorites') });
  };

  if (isLoading) {
    return (
      <div className='flex min-h-[calc(100vh-57px)] items-center justify-center'>
        <p className='text-sm text-muted-foreground'>Loading...</p>
      </div>
    );
  }

  return (
    <main className='max-w-5xl mx-auto px-4 py-10'>
      <div className='mb-8'>
        <EyebrowLabel>Collection</EyebrowLabel>
        <h1 className='text-2xl font-bold font-playfair text-foreground'>My Favorites</h1>
      </div>

      {favorites.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-16 gap-3'>
          <Heart className='w-10 h-10 text-muted-foreground/30' />
          <p className='text-sm text-muted-foreground'>No favorites yet</p>
          <Link to='/paintings' className='text-sm text-brand-green hover:underline'>
            Browse paintings
          </Link>
        </div>
      ) : (
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {favorites.map(({ id, paintingId, painting }) => (
            <div key={id} className='relative group'>
              <Link
                to='/painting-detail/$paintingId'
                params={{ paintingId: painting.id }}
                className='block rounded-2xl border border-border bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow'
              >
                <div className='aspect-square overflow-hidden bg-muted'>
                  {painting.imageUrl ? (
                    <img
                      src={painting.imageUrl}
                      alt={painting.title}
                      className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center'>
                      <span className='text-4xl'>🎨</span>
                    </div>
                  )}
                </div>

                <div className='p-4 flex flex-col gap-2'>
                  <div className='flex items-start justify-between gap-2'>
                    <p className='text-sm font-semibold text-foreground line-clamp-1'>
                      {painting.title}
                    </p>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${paintingStatusColors[painting.status]}`}
                    >
                      {paintingStatusLabels[painting.status]}
                    </span>
                  </div>
                  <p className='text-sm font-bold text-brand-green'>${painting.price}</p>
                </div>
              </Link>

              <button
                onClick={() => handleRemove(paintingId)}
                className='absolute top-2 right-2 flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors'
              >
                <Heart className='w-4 h-4 fill-current' />
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default FavoritesPage;
