import { REQUEST_URL } from '@/constants'
import request from '@/lib/api/client'
import { Method } from 'axios'
import {
  OAuthCallbackParams,
  OAuthCompleteProfileRequest,
  OAuthProvider,
} from '@/features/auth/types/oauth'

interface AuthAPI {
  login: <T>(data: T) => Promise<any>
  logout: () => Promise<any>
  oauthStart: (params: {
    provider: OAuthProvider
    redirectUri: string
    state: string
    codeChallenge: string
    codeChallengeMethod: 'S256'
    scope?: string
    prompt?: string
  }) => Promise<any>
  oauthCallback: (params: OAuthCallbackParams) => Promise<any>
  oauthGoogleCode: (params: { code: string; state?: string }) => Promise<any>
  completeProfile: (data: OAuthCompleteProfileRequest) => Promise<any>
}

const useAuthAPI = (): AuthAPI => {
  const login = <T>(data: T) => {
    return request({
      method: 'POST' as Method,
      url: REQUEST_URL.PUBLIC.LOGIN,
      data,
    })
  }

  const logout = () => {
    return request({
      method: 'POST' as Method,
      url: REQUEST_URL.PRIVATE.LOGOUT,
    })
  }

  const oauthStart = (params: {
    provider: OAuthProvider
    redirectUri: string
    state: string
    codeChallenge: string
    codeChallengeMethod: 'S256'
    scope?: string
    prompt?: string
  }) => {
    const { provider, ...query } = params

    return request({
      method: 'GET' as Method,
      url: `${REQUEST_URL.PUBLIC.OAUTH}/${provider}`,
      params: query,
    })
  }

  const oauthCallback = (params: OAuthCallbackParams) => {
    const { provider, ...query } = params

    return request({
      method: 'GET' as Method,
      url: `${REQUEST_URL.PUBLIC.OAUTH}/${provider}/callback`,
      params: query,
    })
  }

  const oauthGoogleCode = async (params: { code: string; state?: string }) => {
    const baseUrl = process.env.NEXT_PUBLIC_PAYVUE_API_URI || ''
    const url = `${baseUrl}${REQUEST_URL.PUBLIC.OAUTH}/google/callback`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      credentials: 'include',
      redirect: 'manual',
      body: JSON.stringify(params),
    })

    return {
      redirected: false,
    }
  }

  const completeProfile = (data: OAuthCompleteProfileRequest) => {
    return request({
      method: 'POST' as Method,
      url: REQUEST_URL.PUBLIC.OAUTH_COMPLETE_PROFILE,
      data,
    })
  }

  return {
    login,
    logout,
    oauthStart,
    oauthCallback,
    oauthGoogleCode,
    completeProfile,
  }
}

export default useAuthAPI
