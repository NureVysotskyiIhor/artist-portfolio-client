import type { PaintingStatus } from '@/types/enums/painting.enums';

export interface PaintingResponse {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  status: PaintingStatus;
  isPublic: boolean;
  createdAt: string;
}

export interface PaintingCreateRequest {
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  status: PaintingStatus;
  isPublic: boolean;
}

export interface PaintingUpdateRequest {
  title?: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  status?: PaintingStatus;
  isPublic?: boolean;
}

export interface PaintingsFilteredParams {
  status?: PaintingStatus;
  priceMin?: number;
  priceMax?: number;
}
