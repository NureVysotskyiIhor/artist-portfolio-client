import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';

import type { FavoriteRequest } from '@/types/favorites.types';
import {
  getFavoritesByUserId,
  addFavorite,
  removeFavorite,
  getFavoritesWithPainting,
  getFavoriteStats,
} from '@/api/favorites.api';

export const favoriteKeys = {
  //all: () => ['favorites'] as const,
  byUser: (userId: string) => ['favorites', 'user', userId] as const,
  withPainting: () => ['favorites', 'with-painting'] as const,
  stats: () => ['favorites', 'stats'] as const,
};

export const useFavoritesByUserIdQuery = (userId: string) => {
  return useQuery({
    queryKey: favoriteKeys.byUser(userId),
    queryFn: () => getFavoritesByUserId(userId),
    enabled: !!userId,
  });
};

export const useFavoritesWithPaintingQuery = () => {
  return useQuery({
    queryKey: favoriteKeys.withPainting(),
    queryFn: () => getFavoritesWithPainting(),
  });
};

export const useFavoriteStatsQuery = () => {
  return useQuery({
    queryKey: favoriteKeys.stats(),
    queryFn: () => getFavoriteStats(),
  });
};

export const useAddFavoriteMutation = () => {
  return useMutation({
    mutationFn: (data: FavoriteRequest) => addFavorite(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: favoriteKeys.withPainting() });
      void queryClient.invalidateQueries({ queryKey: favoriteKeys.stats() });
    },
  });
};

export const useRemoveFavoriteMutation = () => {
  return useMutation({
    mutationFn: (data: FavoriteRequest) => removeFavorite(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: favoriteKeys.withPainting() });
      void queryClient.invalidateQueries({ queryKey: favoriteKeys.stats() });
    },
  });
};
