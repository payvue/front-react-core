'use client'

import { useMemo } from 'react'
import type { OnlineSmartStore } from '@/features/smartstore/model/online-smart-store'
import { STORE_SUMMARY_DEFS } from '@/features/smartstore/constants/store-summary'
import type { SmartStoreOverviewStats } from '@/features/smartstore/types'

export const useSmartStoreStats = (stores: OnlineSmartStore[]) => {
  const stats: SmartStoreOverviewStats = useMemo(() => {
    const storeCount = stores.length
    const productCount = stores.reduce((acc, store) => acc + store.products.length, 0)
    const subscriberCount = stores.reduce((acc, store) => acc + store.subscribers, 0)
    const averageRating = storeCount
      ? (stores.reduce((acc, store) => acc + store.rating, 0) / storeCount).toFixed(1)
      : '0.0'

    return {
      storeCount,
      productCount,
      subscriberCount,
      averageRating,
    }
  }, [stores])

  const summaryStat = useMemo(() => buildStoreSummaryItems(stats), [stats])

  return {
    summaryStat,
  }
}
const buildStoreSummaryItems = (stats: SmartStoreOverviewStats) =>
  STORE_SUMMARY_DEFS.map((def) => ({
    key: def.key,
    title: def.title,
    value: def.format ? def.format(stats) : stats[def.statKey!],
    valueDescription: def.valueDescription,
  }))
