import type { PaintingResponse } from "./painting.types";

export interface FavoriteResponse {
  id: string;
  userId: string;
  paintingId: string;
  createdAt: string; // ISO
}

export interface FavoriteStatsResponse {
  totalFavorites: number;
  userId: string;
}

export interface FavoriteRequest {
  userId: string;
  paintingId: string;
}

export interface FavoriteWithPaintingResponse {
  id: string;
  userId: string;
  paintingId: string;
  createdAt: string;
  painting: PaintingResponse;
}