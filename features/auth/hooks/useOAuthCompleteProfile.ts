'use client'

import { useCallback } from 'react'
import useAuthAPI from '@/features/auth/api'
import { responseCode } from '@/features/apis'
import { OAuthCompleteProfileRequest } from '@/features/auth/types/oauth'
import { useUserContext } from '@/components/context/user'

const useOAuthCompleteProfile = () => {
  const { completeProfile } = useAuthAPI()
  const { authorized } = useUserContext()

  const submitProfile = useCallback(
    async (payload: OAuthCompleteProfileRequest) => {
      const response = (await completeProfile(payload)) as { code: responseCode; data?: { access?: string } }

      if (response.code !== responseCode.SUCCESS) {
        throw new Error('OAuth 추가 정보 저장에 실패했습니다')
      }

      const token = response.data?.access
      if (!token) {
        throw new Error('OAuth 토큰이 없습니다')
      }
      authorized(token)
      return response
    },
    [completeProfile, authorized]
  )

  return {
    submitProfile,
  }
}

export default useOAuthCompleteProfile
