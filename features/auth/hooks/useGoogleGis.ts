import { useEffect, useRef, useState } from 'react'

const GIS_SCRIPT_ID = 'google-gis-client'
const GIS_SRC = 'https://accounts.google.com/gsi/client'

const loadGisScript = () => {
  if (typeof window === 'undefined') return Promise.reject(new Error('브라우저 환경이 아닙니다'))

  const existing = document.getElementById(GIS_SCRIPT_ID) as HTMLScriptElement | null
  if (existing && window.google?.accounts?.oauth2) {
    return Promise.resolve()
  }

  if (existing) {
    return new Promise<void>((resolve, reject) => {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('GIS 스크립트 로드 실패')))
    })
  }

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.id = GIS_SCRIPT_ID
    script.src = GIS_SRC
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('GIS 스크립트 로드 실패'))
    document.head.appendChild(script)
  })
}

interface GoogleCodeClientOptions {
  clientId: string
  scope: string
  state?: string
  prompt?: string
  enabled?: boolean
  onCode: (response: {
    code?: string
    state?: string
    error?: string
    error_description?: string
  }) => void
}

export const useGoogleCodeClient = ({
  clientId,
  scope,
  state,
  prompt,
  enabled = true,
  onCode,
}: GoogleCodeClientOptions) => {
  const [isReady, setIsReady] = useState(false)
  const clientRef = useRef<ReturnType<NonNullable<Window['google']>['accounts']['oauth2']['initCodeClient']> | null>(null)

  useEffect(() => {
    if (!enabled) {
      setIsReady(false)
      return
    }

    let isMounted = true

    loadGisScript()
      .then(() => {
        if (!isMounted || !window.google?.accounts?.oauth2) return

        clientRef.current = window.google.accounts.oauth2.initCodeClient({
          client_id: clientId,
          scope,
          ux_mode: 'popup',
          callback: onCode,
          state,
          prompt,
        })

        setIsReady(true)
      })
      .catch(() => {
        if (isMounted) {
          setIsReady(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [clientId, scope, state, prompt, onCode, enabled])

  const requestCode = () => {
    if (!clientRef.current) {
      throw new Error('Google OAuth 클라이언트가 준비되지 않았습니다')
    }

    clientRef.current.requestCode()
  }

  return {
    isReady,
    requestCode,
  }
}
