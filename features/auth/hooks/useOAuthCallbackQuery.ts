'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import useOAuthCallback from '@/features/auth/hooks/useOAuthCallback'
import { OAuthProvider } from '@/features/auth/types/oauth'

interface OAuthCallbackState {
  isLoading: boolean
  error: string | null
}

const useOAuthCallbackQuery = ({ provider }: { provider: OAuthProvider }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { exchangeCode } = useOAuthCallback()
  const [state, setState] = useState<OAuthCallbackState>({
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    const code = searchParams.get('code')
    const stateParam = searchParams.get('state')

    if (!code || !stateParam) {
      setState({ isLoading: false, error: 'OAuth 콜백 파라미터가 없습니다' })
      return
    }

    const redirectUri = `${window.location.origin}/auth/oauth/${provider}/callback`

    exchangeCode({
      provider,
      code,
      state: stateParam,
      redirectUri,
    })
      .then((result) => {
        router.replace('/dashboard')
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : 'OAuth 처리 중 오류가 발생했습니다'
        setState({ isLoading: false, error: message })
      })
  }, [exchangeCode, provider, router, searchParams])

  return state
}

export default useOAuthCallbackQuery
