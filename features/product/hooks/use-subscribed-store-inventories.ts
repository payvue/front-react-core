'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useQueries } from '@tanstack/react-query'
import { smartStoreApi } from '@/features/smartstore/api'
import { SMART_STORE_QUERY_KEYS } from '@/features/smartstore/constants/query'
import { useAppDispatch } from '@/lib/redux/hooks'
import { setStoreInventory } from '@/features/smartstore/state/smartstore-slice'
import type { SmartStoreInfo } from '@/features/smartstore/types'

interface UseSubscribedStoreInventoriesOptions {
  subscribedStores: SmartStoreInfo[]
}

export const useSubscribedStoreInventories = ({
  subscribedStores,
}: UseSubscribedStoreInventoriesOptions) => {
  const dispatch = useAppDispatch()

  const storeIds = useMemo(
    () => subscribedStores.map((store) => store.id).filter((id): id is string => Boolean(id)),
    [subscribedStores],
  )

  const queries = useQueries({
    queries: storeIds.map((storeId) => ({
      queryKey: SMART_STORE_QUERY_KEYS.inventory(storeId),
      queryFn: () => smartStoreApi.getSmartStoreInventory(storeId),
      enabled: Boolean(storeId),
      staleTime: 1000 * 60,
    })),
  })

  const processedRef = useRef<Record<string, number>>({})

  useEffect(() => {
    queries.forEach((query, index) => {
      const storeId = storeIds[index]
      if (!storeId || query.status !== 'success') return
      const updatedAt = query.dataUpdatedAt ?? 0
      if (processedRef.current[storeId] === updatedAt) return

      processedRef.current[storeId] = updatedAt
      query.data?.forEach((record) => dispatch(setStoreInventory(record.toPlain())))
    })
  }, [queries, storeIds, dispatch])

  return queries
}
