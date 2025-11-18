'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { SmartStorePageContextValue } from '@/features/smartstore/types'
import { useOnlineSmartStores } from '@/features/smartstore/hooks/use-online-smart-stores'
import { useSmartStoreStats } from '@/features/smartstore/hooks/use-smartstore-stats'
import {
  useSmartStoreInfoQuery,
  useSmartStoreMembersQuery,
} from '@/features/smartstore/hooks/queries'

const SmartStorePageContext = createContext<SmartStorePageContextValue | null>(null)

interface SmartStorePageProviderProps {
  children: ReactNode
}

export function SmartStorePageProvider({ children }: SmartStorePageProviderProps) {
  useSmartStoreInfoQuery()
  const { stores: onlineStores } = useOnlineSmartStores()
  const [selectedStoreId, setSelectedStoreId] = useState<string>(onlineStores[0]?.id ?? '')

  useSmartStoreMembersQuery(selectedStoreId, {
    enabled: Boolean(selectedStoreId),
  })

  useEffect(() => {
    if (!onlineStores.length) return
    if (!onlineStores.find((store) => store.id === selectedStoreId)) {
      setSelectedStoreId(onlineStores[0].id)
    }
  }, [onlineStores, selectedStoreId])

  const selectedStore = useMemo(
    () => onlineStores.find((store) => store.id === selectedStoreId) ?? null,
    [onlineStores, selectedStoreId],
  )

  const communityMembers = selectedStore?.communityMembers ?? []
  const manager = selectedStore?.manager

  const { summaryStat } = useSmartStoreStats(onlineStores)

  const value = useMemo<SmartStorePageContextValue>(
    () => ({
      stores: onlineStores,
      selectedStoreId,
      selectedStore,
      setSelectedStoreId,
      communityMembers,
      manager,
      summaryStat,
    }),
    [onlineStores, selectedStoreId, selectedStore, communityMembers, manager, summaryStat],
  )

  return <SmartStorePageContext.Provider value={value}>{children}</SmartStorePageContext.Provider>
}

export function useSmartStorePageContext() {
  const context = useContext(SmartStorePageContext)
  if (!context) {
    throw new Error('useSmartStorePageContext must be used within SmartStorePageProvider')
  }
  return context
}
