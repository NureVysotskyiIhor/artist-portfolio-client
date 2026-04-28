import { apiRequest } from './client';

import type {
  PaintingResponse,
  PaintingCreateRequest,
  PaintingUpdateRequest,
} from '@/types/painting.types';

import type { PaintingStatus } from '@/types/enums/painting.enums';

export interface GetPaintingsParams {
  status?: PaintingStatus;
  priceMin?: number;
  priceMax?: number;
}

export const getPaintings = async () => {
  return await apiRequest<PaintingResponse[]>(`/paintings`);
};

export const getPaintingById = async (id: string) => {
  return await apiRequest<PaintingResponse>(`/paintings/${id}`);
};

export const createPainting = async (data: PaintingCreateRequest) => {
  return await apiRequest<PaintingResponse>('/paintings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updatePainting = async (id: string, data: PaintingUpdateRequest) => {
  return await apiRequest<PaintingResponse>(`/paintings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deletePainting = async (id: string) => {
  await apiRequest(`/paintings/${id}`, {
    method: 'DELETE',
  });
};

export const getFilteredPaintings = async ({
  status,
  priceMin,
  priceMax,
}: GetPaintingsParams = {}) => {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  if (priceMin != null) params.set('priceMin', String(priceMin));
  if (priceMax != null) params.set('priceMax', String(priceMax));

  return await apiRequest<PaintingResponse[]>(`/paintings/filter?${params.toString()}`);
};
