'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import useOAuthCallback from '@/features/auth/hooks/useOAuthCallback'

export default function GithubOAuthCallbackPage() {
  const searchParams = useSearchParams()
  const { exchangeCode } = useOAuthCallback()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (!code || !state) {
      setError('OAuth 콜백 파라미터가 없습니다')
      return
    }

    const redirectUri = `${window.location.origin}/auth/oauth/github/callback`

    exchangeCode({
      provider: 'github',
      code,
      state,
      redirectUri,
    })
      .then((result) => {
        window.opener?.postMessage(
          {
            type: 'oauth:result',
            provider: 'github',
            redirectUrl: '/dashboard',
          },
          window.location.origin
        )
        window.close()
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'OAuth 처리 중 오류가 발생했습니다'
        setError(message)
        window.opener?.postMessage(
          {
            type: 'oauth:result',
            provider: 'github',
            error: message,
          },
          window.location.origin
        )
        window.close()
      })
  }, [exchangeCode, searchParams])

  if (error) {
    return <div>OAuth 오류: {error}</div>
  }

  return <div>OAuth 로그인 처리 중...</div>
}
