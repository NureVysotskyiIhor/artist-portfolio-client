import { useMutation } from '@tanstack/react-query'
import { login, registerUser, verifyEmail } from '@/api/auth.api'
import type { RegisterRequest } from '@/api/auth.api'
import type { LoginRequest } from '@/types/auth.types'
import { useAuthStore } from '@/store/auth.store'

export const useRegisterMutation = () =>
  useMutation({
    mutationFn: (data: RegisterRequest) => registerUser(data),
  })

export const useVerifyEmailMutation = () =>
  useMutation({
    mutationFn: (token: string) => verifyEmail(token),
  })

export const useLoginMutation = () => {
  const { setToken } = useAuthStore()
  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (data) => {
      setToken(data.token, data.isArtist)
    },
  })
}