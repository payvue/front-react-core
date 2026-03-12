import { useUserContext } from '@/components/context/user'
import APPLICATION_ERROR_CODE from '@/constants/error'
import PATH from '@/constants/path'
import { responseCode } from '@/features/apis'
import { Request } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import useAuthAPI from './api'

interface LoginRequest {
  email: string
  password: string
}

const useAuthQuery = () => {
  const { authorized, unauthorized } = useUserContext()
  const { login: loginAPI, logout: logoutAPI } = useAuthAPI()
  const router = useRouter()

  const { mutateAsync: login } = useMutation({
    mutationFn: (data: LoginRequest) => loginAPI<LoginRequest>(data),
    onSuccess: (response) => {
      if (response.code === responseCode.SUCCESS) {
        const token = response.data?.access
        if (!token) {
          throw new Error('로그인 토큰이 없습니다.')
        }
        authorized(token)
      }
    },
    onError: (error: Request.Error) => {
      if (
        error.code === APPLICATION_ERROR_CODE.NETWORK_ERROR ||
        error.code === APPLICATION_ERROR_CODE.INTERNAL_SERVER_ERROR
      ) {
        router.push(`${PATH.ERROR}?code=${error.code}`)
      }
    },
  })

  const { mutateAsync: logout } = useMutation({
    mutationFn: () => logoutAPI(),
    onSuccess: ({ code }) => {
      if (code === responseCode.SUCCESS) {
        unauthorized()
      }
    },
    onError: (error: Request.Error) => {
      if (
        error.code === APPLICATION_ERROR_CODE.NETWORK_ERROR ||
        error.code === APPLICATION_ERROR_CODE.INTERNAL_SERVER_ERROR
      ) {
        router.push(`${PATH.ERROR}?code=${error.code}`)
      }
    },
  })

  return {
    login,
    logout,
  }
}

export default useAuthQuery
