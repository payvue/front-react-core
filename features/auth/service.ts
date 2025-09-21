import { ApiResponse } from "../../lib/api/types"
import { CompleteProfileRequest, LoginRequest, OAuthRequest, RegisterRequest, User } from "./types"


class AuthService {
  async login(credentials: LoginRequest): Promise<ApiResponse<User>> {
    // For now, simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockUser: User = {
      id: "1",
      email: credentials.email,
      name: "김사용자",
      balance: 150000,
      isLoggedIn: true,
    }

    return {
      success: true,
      data: mockUser,
      message: "로그인 성공",
    }
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<User>> {
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const mockUser: User = {
      id: Date.now().toString(),
      email: userData.email,
      name: userData.name,
      balance: 0,
      isLoggedIn: true,
      phone: userData.phone,
    }

    return {
      success: true,
      data: mockUser,
      message: "회원가입 성공",
    }
  }

  async oauthLogin(oauthData: OAuthRequest): Promise<ApiResponse<User>> {
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const isExistingUser = Math.random() > 0.5

    if (isExistingUser) {
      const mockUser: User = {
        id: "oauth-" + Date.now(),
        email: `user@${oauthData.provider}.com`,
        name: "OAuth 사용자",
        balance: 75000,
        isLoggedIn: true,
        provider: oauthData.provider,
      }

      return {
        success: true,
        data: mockUser,
        message: "OAuth 로그인 성공",
      }
    } else {
      localStorage.setItem(
        "oauthTemp",
        JSON.stringify({
          provider: oauthData.provider,
          email: `newuser@${oauthData.provider}.com`,
          name: `${oauthData.provider} 사용자`,
        }),
      )

      return {
        success: false,
        error: "PROFILE_INCOMPLETE",
        message: "추가 정보 입력이 필요합니다",
      }
    }
  }

  async completeProfile(profileData: CompleteProfileRequest): Promise<ApiResponse<User>> {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const oauthTemp = localStorage.getItem("oauthTemp")
    if (!oauthTemp) {
      return {
        success: false,
        error: "OAuth 임시 데이터를 찾을 수 없습니다",
      }
    }

    const tempData = JSON.parse(oauthTemp)
    const mockUser: User = {
      id: "oauth-" + Date.now(),
      email: tempData.email,
      name: profileData.name,
      balance: 0,
      isLoggedIn: true,
      provider: tempData.provider,
      phone: profileData.phone,
      address: profileData.address,
    }

    return {
      success: true,
      data: mockUser,
      message: "프로필 완성 및 가입 완료",
    }
  }

  async logout(): Promise<ApiResponse<void>> {
    return {
      success: true,
      message: "로그아웃 완료",
    }
  }

  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null

    // First try to get from Redux persisted state
    const reduxAuth = localStorage.getItem("redux_auth")
    if (reduxAuth) {
      try {
        const authData = JSON.parse(reduxAuth)
        return authData.user || null
      } catch {
        // Fall through to legacy method
      }
    }

    // Fallback to legacy localStorage method
    const userData = localStorage.getItem("user")
    if (!userData) return null

    try {
      return JSON.parse(userData)
    } catch {
      return null
    }
  }

  isAuthenticated(): boolean {
    const user = this.getCurrentUser()
    return user?.isLoggedIn === true
  }
}

export const authService = new AuthService()
