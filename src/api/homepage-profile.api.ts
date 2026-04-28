import { apiRequest } from './client';

import type {
  HomepageProfileCreateRequest,
  HomepageProfileResponse,
  HomepageProfileUpdateRequest,
} from '@/types/homepage-profile.types';

export const getHomepageProfile = async () => {
  return await apiRequest<HomepageProfileResponse>(`/homepage-profile`);
};

export const createHomepageProfile = async (data: HomepageProfileCreateRequest) => {
  return await apiRequest<HomepageProfileResponse>('/homepage-profile', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateHomepageProfile = async (data: HomepageProfileUpdateRequest) => {
  return await apiRequest<HomepageProfileResponse>(`/homepage-profile`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};
