import type { LoginRequest, LoginResponse } from '@/types/auth.types'
import { apiRequest } from './client'
import type { UserResponse } from '@/types/user.types'

export interface RegisterRequest {
  email: string
  name: string
  avatarUrl?: string
  bio?: string
}

export const registerUser = async (data: RegisterRequest) =>
  await apiRequest<UserResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const verifyEmail = async (token: string) =>
  await apiRequest<string>(`/auth/verify?token=${token}`)

export const login = async (data: LoginRequest) =>
  await apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })