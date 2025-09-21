"use client"

import { useState } from "react"
import { authService, type LoginRequest, type RegisterRequest } from "@/features/auth"
import { 
  setLoading, 
  setError, 
  clearError, 
  logout,
  authenticated, 
} from "@/features/auth"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"

export function useAuth() {

  const dispatch = useAppDispatch()
  const { user, isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth)

  const checkAuth = async () => {
    if (user && isAuthenticated) return true
    return false
  }

  const handleLogin = async (credentials: LoginRequest) => {

    dispatch(setLoading(true))
    dispatch(clearError())

    try {
      const response = await authService.login(credentials)

      if (response.success && response.data) {
        dispatch(authenticated(response.data))
        dispatch(setLoading(false))
        return { success: true }
      }

      const errorMessage = response.error || "로그인에 실패했습니다"
      dispatch(setError(errorMessage))
      return { success: false, error: response.error }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "로그인 중 오류가 발생했습니다"
      dispatch(setError(errorMessage))
      return { success: false, error: errorMessage }
    } finally {
      dispatch(setLoading(false))
    }
  }

  const handleRegister = async (userData: RegisterRequest) => {

    dispatch(setLoading(true))
    dispatch(clearError())

    try {
      const response = await authService.register(userData)

      if (response.success && response.data) {
        return { success: true }
      }

      const errorMessage = response.error || "회원가입에 실패했습니다"
      dispatch(setError(errorMessage))
      return { success: false, error: response.error }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "회원가입 중 오류가 발생했습니다"
      dispatch(setError(errorMessage))
      return { success: false, error: errorMessage }

    } finally {
      dispatch(setLoading(false))
    }
  }

  const handleOAuthLogin = async (provider: string, code: string) => {

    dispatch(setLoading(true))
    dispatch(clearError())

    try {
      const response = await authService.oauthLogin({ provider, code })

      if (response.success && response.data) {
        dispatch(authenticated(response.data))
        return { success: true, redirectTo: "/dashboard" }
      } 
      
      if (response.error === "PROFILE_INCOMPLETE") {
        return { success: false, redirectTo: "/auth/complete-profile" }
      } 

      const errorMessage = response.error || "OAuth 로그인에 실패했습니다"
      dispatch(setError(errorMessage))
      return { success: false, error: response.error }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "OAuth 로그인 중 오류가 발생했습니다"
      dispatch(setError(errorMessage))
      return { success: false, error: errorMessage }
      
    } finally {
      dispatch(setLoading(false))
    }
  }

  const handleLogout = async () => {
    
    dispatch(setLoading(true))

    try {
      // Use the performLogout thunk which handles all cleanup
      await dispatch(logout())
    } catch (err) {
      console.error("Logout error:", err)
    } finally {
      dispatch(setLoading(false))
    }
  }


  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    checkAuth,
    login: handleLogin,
    register: handleRegister,
    oauthLogin: handleOAuthLogin,
    logout: handleLogout,
    clearError: () => dispatch(clearError()),
  }
}