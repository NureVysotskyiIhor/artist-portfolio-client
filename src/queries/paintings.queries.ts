import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import {
  getPaintings,
  getPaintingById,
  createPainting,
  updatePainting,
  deletePainting,
  getFilteredPaintings,
} from '@/api/paintings.api';
import type { PaintingCreateRequest, PaintingUpdateRequest } from '@/types/painting.types';
import type { GetPaintingsParams } from '@/api/paintings.api';

export const paintingKeys = {
  all: () => ['paintings'] as const,
  filtered: (params: GetPaintingsParams) => ['paintings', 'filtered', params] as const,
  detail: (id: string) => ['paintings', id] as const,
};

export const usePaintingsQuery = () => {
  return useQuery({
    queryKey: paintingKeys.all(),
    queryFn: () => getPaintings(),
  });
};

export const useFilteredPaintingsQuery = (params: GetPaintingsParams = {}) => {
  return useQuery({
    queryKey: paintingKeys.filtered(params),
    queryFn: () => getFilteredPaintings(params),
  });
};

export const usePaintingsByIdQuery = (id: string) => {
  return useQuery({
    queryFn: () => getPaintingById(id),
    queryKey: paintingKeys.detail(id),
    enabled: !!id,
  });
};

export const useCreatePaintingMutation = () => {
  return useMutation({
    mutationFn: (data: PaintingCreateRequest) => createPainting(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: paintingKeys.all() });
    },
  });
};

export const useUpdatePaintingMutation = () => {
  return useMutation({
    mutationFn: (params: { id: string; data: PaintingUpdateRequest }) =>
      updatePainting(params.id, params.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: paintingKeys.all() });
    },
  });
};

export const useDeletePaintingMutation = () => {
  return useMutation({
    mutationFn: (id: string) => deletePainting(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: paintingKeys.all() });
    },
  });
};
