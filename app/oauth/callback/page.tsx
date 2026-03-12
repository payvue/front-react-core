'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function OAuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')
    const provider = searchParams.get('provider') || 'google'

    if (!token) {
      router.replace('/login')
      return
    }

    const channel = new BroadcastChannel('oauth-channel')
    channel.postMessage({ type: 'oauth:result', provider, token })
    channel.close()

    window.close()
    router.replace('/dashboard')
  }, [router, searchParams])

  return <div>OAuth 로그인 처리 중...</div>
}
