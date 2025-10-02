"use client"

import { User } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, ReactNode, useContext, useEffect } from "react";
import isExpired from '../../util/jwt';
import APIResponse from "@/lib/api/types/response";
import { authenticated, fetchUserInfo, unauthenticated } from "@/features/auth";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import useAsyncAccountQuery from "@/features/account/useAsyncAccountQuery";

interface UserContextType {
  authorized: (token: string) => void
  unauthorized: () => void
  isAuthenticated: () => boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined);
export const QUERY_USER_KEY = ["user"]

const UserProvider = ({ children }: { children: ReactNode }) => {

  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()
  const { fetch } = useAsyncAccountQuery(() => isAuthenticated)
  const user: User.Context = useAppSelector((state) => state.auth.domain)

  useEffect(() => {
    if (user) {
      const cachedData = queryClient.getQueryData<User.Context>(QUERY_USER_KEY);
      if (JSON.stringify(cachedData) !== JSON.stringify(user)) {
        queryClient.setQueryData(QUERY_USER_KEY, user);
      }
    }
  }, [user])

  useEffect(() => {
    fetch()
  }, [user.account.status.isLoggedIn, user.account.token])
  
  const authorized = (token: string) => {
    dispatch(authenticated(token))
  }

  const unauthorized = () => {
    dispatch(unauthenticated())
  }

  const isAuthenticated = () => {
    return (user.account.status.isLoggedIn && !isExpired(user.account.token))
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