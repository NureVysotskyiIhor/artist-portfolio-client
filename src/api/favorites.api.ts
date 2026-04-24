import { apiRequest } from "./client";

import type { FavoriteRequest, FavoriteStatsResponse, FavoriteResponse, FavoriteWithPaintingResponse } from "@/types/favorites.types";

export const getFavoritesByUserId = async (userId: string) => {
    return await apiRequest<FavoriteResponse[]>(`/favorites/${userId}`);
}

export const addFavorite = async (data: FavoriteRequest) => {
    return await apiRequest<FavoriteResponse>('/favorites', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export const removeFavorite = async (data: FavoriteRequest) => {
    await apiRequest(`/favorites/`, {
        method: 'DELETE',
        body: JSON.stringify(data),
     });
}

export const getFavoritesWithPainting = async (userId: string) => {
    return await apiRequest<FavoriteWithPaintingResponse[]>(`/favorites/with-painting/${userId}`);
}

export const getFavoriteStats = async () => {
    return await apiRequest<FavoriteStatsResponse[]>(`/favorites/stats`);
}