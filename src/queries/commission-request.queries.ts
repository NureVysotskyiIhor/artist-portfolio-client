import { useMutation, useQuery } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'

import type {
    CommissionRequestCreateRequest,
    CommissionRequestUpdateRequest,
    CommissionRequestArtistNoteUpdateRequest,
    CommissionRequestNearbyParams
} from "@/types/commission-request.types";

import {
    getCommissionRequests,
    getCommissionRequestById,
    getCommissionRequestsByUserId,
    getCommissionRequestsNearby,
    createCommissionRequest,
    updateCommissionRequest,
    updateCommissionRequestArtistNote,
    deleteCommissionRequest
} from '@/api/commission-request.api';

export const commissionRequestKeys = {
    all: () => ['commissionRequests'] as const,
    detail: (id: string) => ['commissionRequests', id] as const,
    byUser: (userId: string) => ['commissionRequests', 'user', userId] as const,
    nearby: (params: CommissionRequestNearbyParams) => ['commissionRequests', 'nearby', params] as const,
}

export const useCommissionRequestsQuery = () => {
    return useQuery({
        queryKey: commissionRequestKeys.all(),
        queryFn: () => getCommissionRequests(),
    });
}

export const useCommissionRequestByIdQuery = (id: string) => {
    return useQuery({
        queryKey: commissionRequestKeys.detail(id),
        queryFn: () => getCommissionRequestById(id),
        enabled: !!id,
    });
}
        
export const useCommissionRequestsByUserIdQuery = (userId: string) => {
    return useQuery({
        queryKey: commissionRequestKeys.byUser(userId),
        queryFn: () => getCommissionRequestsByUserId(userId),
        enabled: !!userId,
    });
}

export const useCommissionRequestsNearbyQuery = (params: CommissionRequestNearbyParams) => {
    return useQuery({
        queryKey: commissionRequestKeys.nearby(params),
        queryFn: () => getCommissionRequestsNearby(params),
        enabled: !!params.latitude && !!params.longitude && !!params.radiusKm,
    });
}

export const useCreateCommissionRequestMutation = () => {
    return useMutation({
        mutationFn: (data: CommissionRequestCreateRequest) => createCommissionRequest(data),
        onSuccess: (_, variables) => {  
            queryClient.invalidateQueries({ queryKey: commissionRequestKeys.byUser(variables.userId) })  
        }
    });
}

export const useUpdateCommissionRequestMutation = () => {
    return useMutation({
        mutationFn: (params: { id: string; userId: string; data: CommissionRequestUpdateRequest }) => updateCommissionRequest(params.id, params.data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: commissionRequestKeys.detail(variables.id) })
            queryClient.invalidateQueries({ queryKey: commissionRequestKeys.byUser(variables.userId) })
        }
    });
}

export const useUpdateCommissionRequestArtistNoteMutation = () => {
    return useMutation({
        mutationFn: (params: { id: string; artistId: string; data: CommissionRequestArtistNoteUpdateRequest }) => updateCommissionRequestArtistNote(params.id, params.artistId, params.data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: commissionRequestKeys.all() })
            queryClient.invalidateQueries({ queryKey: commissionRequestKeys.detail(variables.id) })
        }
    });
}

export const useDeleteCommissionRequestMutation = () => {
    return useMutation({
        mutationFn: (params: { id: string; userId: string }) => deleteCommissionRequest(params.id),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: commissionRequestKeys.detail(variables.id) })
            queryClient.invalidateQueries({ queryKey: commissionRequestKeys.byUser(variables.userId) })
        }
    });
}