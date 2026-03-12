'use client'

import { useCallback, useMemo } from 'react'
import { SESSION_STORAGE_KEY } from '@/constants'
import { OAuthProfile, OAuthProvider } from '@/features/auth/types/oauth'

const getSessionItem = <T>(key: string): T | null => {
  if (typeof window === 'undefined') return null
  const raw = sessionStorage.getItem(key)
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

const setSessionItem = (key: string, value: unknown) => {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(key, JSON.stringify(value))
}

const removeSessionItem = (key: string) => {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(key)
}

export const useOAuthStorage = () => {
  const setOAuthState = useCallback(
    (state: string) => setSessionItem(SESSION_STORAGE_KEY.OAUTH_STATE, state),
    []
  )
  const getOAuthState = useCallback(
    () => getSessionItem<string>(SESSION_STORAGE_KEY.OAUTH_STATE),
    []
  )

  const setCodeVerifier = useCallback(
    (verifier: string) => setSessionItem(SESSION_STORAGE_KEY.OAUTH_CODE_VERIFIER, verifier),
    []
  )
  const getCodeVerifier = useCallback(
    () => getSessionItem<string>(SESSION_STORAGE_KEY.OAUTH_CODE_VERIFIER),
    []
  )

  const setProvider = useCallback(
    (provider: OAuthProvider) => setSessionItem(SESSION_STORAGE_KEY.OAUTH_PROVIDER, provider),
    []
  )
  const getProvider = useCallback(
    () => getSessionItem<OAuthProvider>(SESSION_STORAGE_KEY.OAUTH_PROVIDER),
    []
  )

  const setOAuthProfile = useCallback(
    (profile: OAuthProfile) => setSessionItem(SESSION_STORAGE_KEY.OAUTH_PROFILE, profile),
    []
  )
  const getOAuthProfile = useCallback(
    () => getSessionItem<OAuthProfile>(SESSION_STORAGE_KEY.OAUTH_PROFILE),
    []
  )

  const clearOAuthSession = useCallback(() => {
    removeSessionItem(SESSION_STORAGE_KEY.OAUTH_STATE)
    removeSessionItem(SESSION_STORAGE_KEY.OAUTH_CODE_VERIFIER)
    removeSessionItem(SESSION_STORAGE_KEY.OAUTH_PROVIDER)
  }, [])

  const clearOAuthProfile = useCallback(
    () => removeSessionItem(SESSION_STORAGE_KEY.OAUTH_PROFILE),
    []
  )

  return useMemo(
    () => ({
      setOAuthState,
      getOAuthState,
      setCodeVerifier,
      getCodeVerifier,
      setProvider,
      getProvider,
      setOAuthProfile,
      getOAuthProfile,
      clearOAuthSession,
      clearOAuthProfile,
    }),
    [
      setOAuthState,
      getOAuthState,
      setCodeVerifier,
      getCodeVerifier,
      setProvider,
      getProvider,
      setOAuthProfile,
      getOAuthProfile,
      clearOAuthSession,
      clearOAuthProfile,
    ]
  )
}
