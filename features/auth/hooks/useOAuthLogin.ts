'use client'

import { useCallback } from 'react'
import useAuthAPI from '@/features/auth/api'
import { OAuthProvider, OAuthStartResponse } from '@/features/auth/types/oauth'
import { useOAuthPKCE } from '@/features/auth/hooks/useOAuthPKCE'
import { useOAuthStorage } from '@/features/auth/hooks/useOAuthStorage'
import { responseCode } from '@/features/apis'
import { useUserContext } from '@/components/context/user'

interface OAuthLoginOptions {
  scope?: string
  prompt?: string
}

const useOAuthLogin = ({ scope, prompt }: OAuthLoginOptions) => {
  const { oauthStart } = useAuthAPI()
  const { authorized } = useUserContext()
  const { createVerifier, createChallenge, createState } = useOAuthPKCE()
  const { setOAuthState, setCodeVerifier, setProvider } = useOAuthStorage()

  const startLogin = useCallback(
    async (provider: OAuthProvider, redirectUri: string) => {
      const state = createState()
      const codeVerifier = createVerifier()
      const codeChallenge = await createChallenge(codeVerifier)

      setOAuthState(state)
      setCodeVerifier(codeVerifier)
      setProvider(provider)

      const response = (await oauthStart({
        provider,
        redirectUri,
        state,
        codeChallenge,
        codeChallengeMethod: 'S256',
        scope,
        prompt,
      })) as { code: responseCode; data?: OAuthStartResponse }

      if (response.code !== responseCode.SUCCESS || !response.data?.redirectUrl) {
        throw new Error('OAuth 시작에 실패했습니다')
      }

      if (response.code == responseCode.SUCCESS) {
        authorized('cookie')
      }

      return response.data.redirectUrl
    },
    [
      oauthStart,
      createState,
      createVerifier,
      createChallenge,
      setOAuthState,
      setCodeVerifier,
      setProvider,
      scope,
      prompt,
    ],
  )

  return {
    startLogin,
  }
}

export default useOAuthLogin
