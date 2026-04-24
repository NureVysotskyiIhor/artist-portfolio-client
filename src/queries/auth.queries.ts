import { useMutation } from '@tanstack/react-query'
import { login, register, verifyEmail } from '@/api/auth.api'
import type { RegisterRequest } from '@/api/auth.api'
import type { LoginRequest } from '@/types/auth.types'

export const useRegisterMutation = () =>
  useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
  })

export const useVerifyEmailMutation = () =>
  useMutation({
    mutationFn: (token: string) => verifyEmail(token),
  })

export const useLoginMutation = () =>
  useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('isArtist', data.isArtist.toString());
    }
  })