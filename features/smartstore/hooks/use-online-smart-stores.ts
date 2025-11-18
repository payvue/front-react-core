'use client'

import { useMemo } from 'react'
import { OnlineSmartStore } from '@/features/smartstore/model'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import {
  selectInfoStatus,
  selectStats,
  selectStores,
  selectSubscribedProducts,
  selectSubscribedStores,
  selectStoreCommunityProfiles,
} from '../state/smartstore-selectors'
import type { SmartStoreInfo } from '../types'
import { addStore, toggleSubscription } from '../state/smartstore-slice'

interface UseOnlineSmartStoresOptions {
  renew?: {
    ready: boolean
    loading: boolean
    error: boolean
    updatedAt: number
  }
}

export const useOnlineSmartStores = (options: UseOnlineSmartStoresOptions = {}) => {
  const dispatch = useAppDispatch()

  const stores = useAppSelector(selectStores)
  const subscribedStores = useAppSelector(selectSubscribedStores)
  const subscribedProducts = useAppSelector(selectSubscribedProducts)
  const stats = useAppSelector(selectStats)
  const communityProfiles = useAppSelector(selectStoreCommunityProfiles)
  const infoStatus = useAppSelector(selectInfoStatus)

  const isReady = options.renew?.ready ?? infoStatus === 'success'
  const isLoading = options.renew?.loading ?? infoStatus === 'loading'
  const isError = options.renew?.error ?? infoStatus === 'error'
  const updatedAt = options.renew?.updatedAt ?? 0

  const onlineStores = useMemo(() => {
    if (!isReady) return []
    return stores.map((store) => new OnlineSmartStore(store, communityProfiles[store.id]))
  }, [stores, communityProfiles, isReady, updatedAt])

  return {
    stores: onlineStores,
    subscribedStores,
    subscribedProducts,
    stats,
    isReady,
    isLoading,
    isError,
    toggleSubscription: (storeId: string) => dispatch(toggleSubscription(storeId)),
    addStore: (payload: SmartStoreInfo) => dispatch(addStore(payload)),
  }
}
