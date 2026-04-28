import { apiRequest } from './client';

import type {
  ArtistResponse,
  ArtistCreateRequest,
  ArtistUpdateRequest,
} from '@/types/artist.types';

export const getArtistById = async (id: string) => {
  return await apiRequest<ArtistResponse>(`/artist/${id}`);
};

export const createArtist = async (data: ArtistCreateRequest) => {
  return await apiRequest<ArtistResponse>('/artist', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateArtist = async (id: string, data: ArtistUpdateRequest) => {
  return await apiRequest<ArtistResponse>(`/artist/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};
