export interface CommissionTopicResponse {
  id: string;
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
}

export interface CommissionTopicCreateRequest {
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
}

export interface CommissionTopicUpdateRequest {
  name?: string;
  description?: string;
  icon?: string;
  isActive?: boolean;
}
