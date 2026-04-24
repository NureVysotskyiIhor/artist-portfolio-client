import { useMutation, useQuery } from "@tanstack/react-query";

import {
  getArtistById,
  createArtist,
  updateArtist,
} from "@/api/artist.api";
import type { ArtistCreateRequest, ArtistUpdateRequest } from "@/types/artist.types";
import { queryClient } from "@/lib/query-client";

export const artistKeys = {
    detail: (id: string) => ["artists", id] as const,
};

export const useArtistByIdQuery = (id: string) => {
    return useQuery({
        queryKey: artistKeys.detail(id),
        queryFn: () => getArtistById(id),
        enabled: !!id,
    });
}

export const useCreateArtistMutation = () => {
    return useMutation({
        mutationFn: (data: ArtistCreateRequest) => createArtist(data),
        onSuccess: (variables) => {
            queryClient.invalidateQueries({ queryKey: artistKeys.detail(variables.id) });
        }
    });
}

export const useUpdateArtistMutation = () => {
    return useMutation({
        mutationFn: (params: { id: string; data: ArtistUpdateRequest }) => updateArtist(params.id, params.data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: artistKeys.detail(variables.id) });
        }
    });
}
