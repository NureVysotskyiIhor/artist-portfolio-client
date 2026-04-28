// auth.types.ts
import type { UserResponse } from '@/types/user.types';

export interface RegisterRequest {
  email: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export type RegisterResponse = UserResponse;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  isArtist: boolean;
}
