export type OAuthProvider = 'google' | 'github'

export interface OAuthStartParams {
  provider: OAuthProvider
  redirectUri: string
  scope?: string
  prompt?: string
}

export interface OAuthStartResponse {
  redirectUrl: string
}

export interface OAuthCallbackParams {
  provider: OAuthProvider
  code: string
  state: string
  redirectUri: string
  codeVerifier: string
}

export interface OAuthProfile {
  email: string
  name: string
  provider: OAuthProvider
}

export interface OAuthCallbackResponse {
  access: string
  user?: {
    id: string
    email: string
    name: string
    provider: OAuthProvider
  }
}

export interface OAuthCompleteProfileRequest {
  name: string
  phone: string
  address: string
  birthYear: string
  occupation: string
}
