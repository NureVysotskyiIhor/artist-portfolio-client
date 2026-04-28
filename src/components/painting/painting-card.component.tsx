import { Link } from '@tanstack/react-router';
import type { PaintingResponse } from '@/types/painting.types';
import type { FavoriteWithPaintingResponse } from '@/types/favorites.types';
import { FavoriteButton } from '@/components/painting/favorite-button.component';
import { paintingStatusColors, paintingStatusLabels } from '@/utils/painting-status.utils';

interface PaintingCardProps {
  painting: PaintingResponse;
  isArtist?: boolean;
  isAuthenticated?: boolean;
  favorites?: FavoriteWithPaintingResponse[];
  favoriteStats: number;
}

export const PaintingCard = ({
  painting,
  isArtist,
  isAuthenticated = false,
  favorites = [],
  favoriteStats,
}: PaintingCardProps) => {
  return (
    <Link
      to='/painting-detail/$paintingId'
      params={{ paintingId: painting.id }}
      className='group block rounded-2xl border border-border bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow'
    >
      <div className='relative aspect-square overflow-hidden bg-muted'>
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
        <div className='absolute top-2 right-2'>
          <FavoriteButton
            paintingId={painting.id}
            favorites={favorites}
            isAuthenticated={isAuthenticated && !isArtist}
          />
        </div>
      </div>

      <div className='p-4 flex flex-col gap-2'>
        <div className='flex items-start justify-between gap-2'>
          <p className='text-sm font-semibold text-foreground line-clamp-1'>{painting.title}</p>
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${paintingStatusColors[painting.status]}`}
          >
            {paintingStatusLabels[painting.status]}
          </span>
        </div>

        <p className='text-xs text-muted-foreground line-clamp-2'>{painting.description}</p>

        <div className='flex items-center justify-between mt-1'>
          <p className='text-sm font-bold text-brand-green'>${painting.price}</p>
          <span className='text-[10px] text-muted-foreground flex items-center gap-1'>
            ♥ {favoriteStats}
          </span>
          {isArtist && !painting.isPublic && (
            <span className='text-[10px] text-muted-foreground'>Private</span>
          )}
        </div>
      </div>
    </Link>
  );
};
