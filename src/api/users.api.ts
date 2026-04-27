import { apiRequest } from "./client";

import type {
    UserResponse,
    UserUpdateRequest
} from "@/types/user.types";

export const getUserMe = async () => {
    return await apiRequest<UserResponse>(`/users/me`);
}

export const getUserProfileById = async (id: string) => {
    return await apiRequest<UserResponse>(`/users/${id}`);
}

export const updateUserProfile = async (id: string, data: UserUpdateRequest) => {
    return await apiRequest<UserResponse>(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
     });
}

export const deleteUserProfile = async (id: string) => {
    await apiRequest(`/users/${id}`, {
        method: 'DELETE',
     });
}