export interface User {
    id: string
    email: string
    name: string
    balance: number
    isLoggedIn: boolean
    provider?: string
    avatar?: string
    phone?: string
    address?: string
  }
  

  export interface LoginRequest {
    email: string
    password: string
  }
  
  export interface RegisterRequest {
    email: string
    password: string
    name: string
    phone?: string
  }
  
  export interface OAuthRequest {
    provider: string
    code: string
  }
  
  export interface CompleteProfileRequest {
    name: string
    phone?: string
    address?: string
  }  