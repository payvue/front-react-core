'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Chrome, Github } from 'lucide-react'
import { OAuthProvider } from '@/features/auth/types/oauth'
import { useRouter } from 'next/navigation'
import { useUserContext } from '@/components/context/user'

interface OAuthLoginProps {
  onOAuthLogin: (provider: OAuthProvider) => void
}

interface OAuthMessage {
  type: 'oauth:result'
  provider: OAuthProvider
  error?: string
  redirectUrl?: string
  token?: string
}

export function OAuthLogin({ onOAuthLogin }: OAuthLoginProps) {
  const [isLoading, setIsLoading] = useState<OAuthProvider | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const popupRef = useRef<Window | null>(null)
  const { authorized } = useUserContext()

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID || ''
  const googleAuthorizeUrl =
    process.env.NEXT_PUBLIC_GOOGLE_OAUTH_AUTHORIZE_URL ||
    'http://localhost:8080/oauth2/authorization/google'
  const githubAuthorizeUrl =
    process.env.NEXT_PUBLIC_GITHUB_OAUTH_AUTHORIZE_URL ||
    'http://localhost:8080/oauth2/authorization/github'

  useEffect(() => {
    const channel = new BroadcastChannel('oauth-channel')
    const handleBroadcast = (event: MessageEvent) => {
      const data = event.data as OAuthMessage
      if (!data || data.type !== 'oauth:result') return

      if (!data.token) {
        setError('OAuth 토큰이 없습니다')
        return
      }

      authorized(data.token)
      router.replace('/dashboard')
    }

    channel.addEventListener('message', handleBroadcast)

    const handleMessage = (event: MessageEvent) => {
      const apiOrigin = (process.env.NEXT_PUBLIC_PAYVUE_API_URI || 'http://localhost:8080').replace(
        /\/$/,
        '',
      )
      const allowedOrigins = [window.location.origin, apiOrigin].filter(Boolean)
      if (!allowedOrigins.includes(event.origin)) return

      const data = event.data as OAuthMessage
      if (!data || data.type !== 'oauth:result') return

      if (data.error) {
        setError(data.error)
        return
      }

      if (!data.token) {
        setError('OAuth 토큰이 없습니다')
        return
      }

      authorized(data.token)
      router.replace('/dashboard')
    }

    window.addEventListener('message', handleMessage)

    return () => {
      channel.removeEventListener('message', handleBroadcast)
      channel.close()
      window.removeEventListener('message', handleMessage)
    }
  }, [router, authorized])

  const openBlankPopup = (provider: OAuthProvider) => {
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.close()
    }

    popupRef.current = window.open('', `oauth-${provider}`, 'width=520,height=640')

    if (!popupRef.current) {
      throw new Error('팝업이 차단되었습니다. 팝업 허용 후 다시 시도해주세요')
    }

    try {
      popupRef.current.document.title = 'OAuth 로그인 준비 중'
      popupRef.current.document.body.innerHTML =
        '<p style="font-family: sans-serif; padding: 16px;">로그인 페이지를 불러오는 중입니다...</p>'
    } catch (error) {
      // ignore cross-origin write errors
    }

    return popupRef.current
  }

  const handleGoogleLogin = () => {
    if (!googleClientId) {
      setError('Google OAuth Client ID가 설정되지 않았습니다')
      return
    }

    setIsLoading('google')
    setError(null)

    const popup = openBlankPopup('google')
    popup.location.href = googleAuthorizeUrl
    setIsLoading(null)
  }

  const handleGithubLogin = () => {
    setIsLoading('github')
    setError(null)

    const popup = openBlankPopup('github')
    popup.location.href = githubAuthorizeUrl
    setIsLoading(null)
  }

  const handleOAuthLogin = (provider: OAuthProvider) => {
    onOAuthLogin(provider)

    const handlers: Record<OAuthProvider, () => void> = {
      google: handleGoogleLogin,
      github: handleGithubLogin,
    }

    handlers[provider]()
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">또는</span>
        </div>
      </div>

      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full bg-transparent"
          onClick={() => handleOAuthLogin('google')}
          disabled={isLoading !== null}
        >
          {isLoading === 'google' ? (
            'Google 로그인 중...'
          ) : (
            <>
              <Chrome className="mr-2 h-4 w-4" />
              Google로 로그인
            </>
          )}
        </Button>

        <Button
          variant="outline"
          className="w-full bg-transparent"
          onClick={() => handleOAuthLogin('github')}
          disabled={isLoading !== null}
        >
          {isLoading === 'github' ? (
            'GitHub 로그인 중...'
          ) : (
            <>
              <Github className="mr-2 h-4 w-4" />
              GitHub로 로그인
            </>
          )}
        </Button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
