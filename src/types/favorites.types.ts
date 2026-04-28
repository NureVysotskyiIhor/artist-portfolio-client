import type { PaintingResponse } from './painting.types';

export interface FavoriteResponse {
  id: string;
  userId: string;
  paintingId: string;
  createdAt: string; // ISO
}

export interface FavoritePaintingStatsResponse {
  paintingId: string;
  count: number;
}

export interface FavoriteRequest {
  paintingId: string;
}

export interface FavoriteWithPaintingResponse {
  id: string;
  userId: string;
  paintingId: string;
  createdAt: string;
  painting: PaintingResponse;
}
