'use client'

import { useMutation } from '@tanstack/react-query'
import { Request } from '@/types'
import APPLICATION_ERROR_CODE from '@/constants/error'
import PATH from '@/constants/path'
import { useRouter } from 'next/navigation'
import useAccountAPI from './api'

const useRecoveryQuery = () => {
  const router = useRouter()
  const { findid: findidAPI, resetPassword: resetPasswordAPI } = useAccountAPI()

  const { mutateAsync: findid } = useMutation({
    mutationFn: (data: { email: string }) => findidAPI(data),
    onSuccess: ({ code, message }) => {
      router.push(`/result?action=아이디 찾기&code=${code}&message=${message}`)
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

  const { mutateAsync: resetPassword } = useMutation({
    mutationFn: (data: { email: string; username: string }) => resetPasswordAPI(data),
    onSuccess: ({ code, message }) => {
      router.push(`/result?action=비밀번호 재설정&code=${code}&message=${message}`)
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
    findid,
    resetPassword,
  }
}

export default useRecoveryQuery
