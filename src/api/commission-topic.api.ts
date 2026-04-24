import { apiRequest } from "./client";

import type {
    CommissionTopicResponse,
    CommissionTopicCreateRequest,
    CommissionTopicUpdateRequest
} from "@/types/commission-topic.types";

export const getCommissionTopics = async () => {
    return await apiRequest<CommissionTopicResponse[]>(`/commission-topics`);
}

export const getCommissionTopicById = async (id: string) => {
    return await apiRequest<CommissionTopicResponse>(`/commission-topics/${id}`);
}

export const createCommissionTopic = async (data: CommissionTopicCreateRequest) => {
    return await apiRequest<CommissionTopicResponse>('/commission-topics', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export const updateCommissionTopic = async (id: string, data: CommissionTopicUpdateRequest) => {
    return await apiRequest<CommissionTopicResponse>(`/commission-topics/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export const deleteCommissionTopic = async (id: string) => {
    await apiRequest(`/commission-topics/${id}`, {
        method: 'DELETE',
     });
}