export interface UserResponse {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  bio: string;
  isVerified: boolean;
  createdAt: string; // ISO дата
}

export interface UserUpdateRequest {
  name?: string;
  avatarUrl?: string;
  bio?: string;
}
