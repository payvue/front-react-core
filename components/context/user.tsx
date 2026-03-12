'use client'

import { User } from '@/types'
import { useQueryClient } from '@tanstack/react-query'
import { createContext, ReactNode, useContext, useEffect } from 'react'
import isExpired from '../../util/jwt'
import { authenticated, unauthenticated } from '@/features/auth'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import useAsyncAccountQuery from '@/features/account/useAsyncAccountQuery'

interface UserContextType {
  authorized: (token: string) => void
  unauthorized: () => void
  isAuthenticated: () => boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)
export const QUERY_USER_KEY = ['user']

const UserProvider = ({ children }: { children: ReactNode }) => {
  const user: User.Context = useAppSelector((state) => state.auth.domain)

  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()
  const { fetch } = useAsyncAccountQuery(() => isAuthenticated, user.account.status.isLoggedIn)

  useEffect(() => {
    if (user) {
      const cachedData = queryClient.getQueryData<User.Context>(QUERY_USER_KEY)
      if (JSON.stringify(cachedData) !== JSON.stringify(user)) {
        queryClient.setQueryData(QUERY_USER_KEY, user)
      }
    }
  }, [user, queryClient])

  useEffect(() => {
    fetch()
  }, [fetch])

  const authorized = (token: string) => {
    dispatch(authenticated(token))
  }

  const unauthorized = () => {
    dispatch(unauthenticated())
  }

  const isAuthenticated = () => {
    if (!user.account.status.isLoggedIn) return false

    if (!user.account.token) {
      return true
    }

    return !isExpired(user.account.token)
  }

  return (
    <UserContext.Provider value={{ authorized, unauthorized, isAuthenticated }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUserContext = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export default UserProvider
export { UserContext }
