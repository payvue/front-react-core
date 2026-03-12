'use client'

import { useCallback } from 'react'
import useAuthAPI from '@/features/auth/api'
import { responseCode } from '@/features/apis'
import { OAuthCallbackResponse, OAuthProvider } from '@/features/auth/types/oauth'
import { useOAuthStorage } from '@/features/auth/hooks/useOAuthStorage'
import { useUserContext } from '@/components/context/user'

interface OAuthCallbackInput {
  provider: OAuthProvider
  code: string
  state: string
  redirectUri: string
}

const useOAuthCallback = () => {
  const { oauthCallback } = useAuthAPI()
  const { authorized } = useUserContext()
  const {
    getOAuthState,
    getCodeVerifier,
    clearOAuthSession,
  } = useOAuthStorage()

  const exchangeCode = useCallback(
    async ({ provider, code, state, redirectUri }: OAuthCallbackInput) => {
      const storedState = getOAuthState()
      if (!storedState || storedState !== state) {
        throw new Error('OAuth state 값이 일치하지 않습니다')
      }

      const codeVerifier = getCodeVerifier()
      if (!codeVerifier) {
        throw new Error('OAuth code verifier가 없습니다')
      }

      const response = (await oauthCallback({
        provider,
        code,
        state,
        redirectUri,
        codeVerifier,
      })) as { code: responseCode; data?: OAuthCallbackResponse }

      if (response.code !== responseCode.SUCCESS || !response.data) {
        throw new Error('OAuth 콜백 처리에 실패했습니다')
      }

      clearOAuthSession()

      const token = response.data?.access
      if (!token) {
        throw new Error('OAuth 토큰이 없습니다')
      }
      authorized(token)
      return { isNew: false }
    },
    [oauthCallback, getOAuthState, getCodeVerifier, clearOAuthSession, authorized]
  )

  return {
    exchangeCode,
  }
}

export default useOAuthCallback
