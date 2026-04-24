import { useMutation, useQuery } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'

import type {
    CommissionTopicCreateRequest,
    CommissionTopicUpdateRequest,
} from '@/types/commission-topic.types'
import { getCommissionTopics, getCommissionTopicById, createCommissionTopic, updateCommissionTopic, deleteCommissionTopic} from '@/api/commission-topic.api';

export const commissionTopicKeys = {
    all: () => ['commissionTopics'] as const,
    detail: (id: string) => ['commissionTopics', id] as const,
}

export const useCommissionTopicsQuery = () => {
    return useQuery({
        queryKey: commissionTopicKeys.all(),
        queryFn: () => getCommissionTopics(),
    });
}

export const useCommissionTopicByIdQuery = (id: string) => {
    return useQuery({
        queryKey: commissionTopicKeys.detail(id),
        queryFn: () => getCommissionTopicById(id),
        enabled: !!id,
    });
}

export const useCreateCommissionTopicMutation = () => {
    return useMutation({
        mutationFn: (data: CommissionTopicCreateRequest) => createCommissionTopic(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: commissionTopicKeys.all() })
        }
    });
}

export const useUpdateCommissionTopicMutation = () => {
    return useMutation({
        mutationFn: (params: { id: string; data: CommissionTopicUpdateRequest }) => updateCommissionTopic(params.id, params.data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: commissionTopicKeys.all() })
            queryClient.invalidateQueries({ queryKey: commissionTopicKeys.detail(variables.id) })
        }
    });
}

export const useDeleteCommissionTopicMutation = () => {
    return useMutation({
        mutationFn: (id: string) => deleteCommissionTopic(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: commissionTopicKeys.all() })
        }
    });
}