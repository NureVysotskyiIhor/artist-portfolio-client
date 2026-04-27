import { useMutation, useQuery } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'

import {
    getUserMe,
    getUserProfileById,
    updateUserProfile,
    deleteUserProfile
} from '@/api/users.api'

import type {
    UserUpdateRequest
} from "@/types/user.types";

export const userKeys = {
    all: () => ['users'] as const,
    userById: (id: string) => ['users', id] as const,
}

export const useUserProfileQuery = () => {
    return useQuery({
        queryKey: userKeys.all(),
        queryFn: () => getUserMe(),
    });
}

export const useUserProfileByIdQuery = (id: string) => {
    return useQuery({
        queryKey: userKeys.userById(id),
        queryFn: () => getUserProfileById(id),
        enabled: !!id,
    });
}

export const useUpdateUserProfileMutation = () => {
    return useMutation({
        mutationFn: (params: { id: string; data: UserUpdateRequest }) => updateUserProfile(params.id, params.data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: userKeys.all() })
            queryClient.invalidateQueries({ queryKey: userKeys.userById(variables.id) })
        }
    });
}

export const useDeleteUserProfileMutation = () => {
    return useMutation({
        mutationFn: (id: string) => deleteUserProfile(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.all() })
        }
    });
}