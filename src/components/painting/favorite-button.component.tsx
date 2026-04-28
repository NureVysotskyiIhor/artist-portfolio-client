import { Heart } from 'lucide-react';
import { useAddFavoriteMutation, useRemoveFavoriteMutation } from '@/queries/favorites.queries';
import { cn } from '@/lib/utils';
import type { FavoriteWithPaintingResponse } from '@/types/favorites.types';

interface FavoriteButtonProps {
  paintingId: string;
  favorites: FavoriteWithPaintingResponse[];
  isAuthenticated: boolean;
}

export const FavoriteButton = ({ paintingId, favorites, isAuthenticated }: FavoriteButtonProps) => {
  const { mutate: addFavorite, isPending: isAdding } = useAddFavoriteMutation();
  const { mutate: removeFavorite, isPending: isRemoving } = useRemoveFavoriteMutation();
  const isPending = isAdding || isRemoving;

  const isFavorited = favorites.some(f => f.paintingId === paintingId);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;

    if (isFavorited) {
      removeFavorite({ paintingId });
    } else {
      addFavorite({ paintingId });
    }
  };

  if (!isAuthenticated) return null;

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        'flex items-center justify-center w-8 h-8 rounded-full transition-colors',
        isFavorited
          ? 'bg-red-50 text-red-500 hover:bg-red-100'
          : 'bg-white/80 text-muted-foreground hover:bg-white hover:text-red-400'
      )}
    >
      <Heart className={cn('w-4 h-4', isFavorited && 'fill-current')} />
    </button>
  );
};
