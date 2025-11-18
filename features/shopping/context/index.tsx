'use client'

import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import type { ShoppingPageContextValue } from '@/features/shopping/types'

const ShoppingPageContext = createContext<ShoppingPageContextValue | null>(null)

interface ProviderProps {
  value: ShoppingPageContextValue
  children: ReactNode
}

export function ShoppingPageProvider({ value, children }: ProviderProps) {
  return <ShoppingPageContext.Provider value={value}>{children}</ShoppingPageContext.Provider>
}

export function useShoppingPageContext() {
  const context = useContext(ShoppingPageContext)
  if (!context) {
    throw new Error('useShoppingPageContext must be used within ShoppingPageProvider')
  }
  return context
}
