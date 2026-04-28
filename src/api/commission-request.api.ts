import { apiRequest } from './client';

import type {
  CommissionRequestResponse,
  CommissionRequestCreateRequest,
  CommissionRequestUpdateRequest,
  CommissionRequestArtistNoteUpdateRequest,
  CommissionRequestNearbyParams,
} from '@/types/commission-request.types';

export const getCommissionRequests = async () => {
  return await apiRequest<CommissionRequestResponse[]>(`/commission-requests`);
};

export const getCommissionRequestById = async (id: string) => {
  return await apiRequest<CommissionRequestResponse>(`/commission-requests/${id}`);
};

export const getCommissionRequestsByUserId = async (userId: string) => {
  return await apiRequest<CommissionRequestResponse[]>(`/commission-requests/user/${userId}`);
};

export const getCommissionRequestsNearby = async (params: CommissionRequestNearbyParams) => {
  const queryParams = new URLSearchParams({
    latitude: String(params.latitude),
    longitude: String(params.longitude),
    radiusKm: String(params.radiusKm),
  }).toString();

  return await apiRequest<CommissionRequestResponse[]>(
    `/commission-requests/nearby?${queryParams}`
  );
};

export const createCommissionRequest = async (data: CommissionRequestCreateRequest) => {
  return await apiRequest<CommissionRequestResponse>('/commission-requests', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateCommissionRequest = async (id: string, data: CommissionRequestUpdateRequest) => {
  return await apiRequest<CommissionRequestResponse>(`/commission-requests/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const updateCommissionRequestArtistNote = async (
  id: string,
  data: CommissionRequestArtistNoteUpdateRequest
) => {
  return await apiRequest<CommissionRequestResponse>(`/commission-requests/${id}/artist`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteCommissionRequest = async (id: string) => {
  await apiRequest(`/commission-requests/${id}`, {
    method: 'DELETE',
  });
};
