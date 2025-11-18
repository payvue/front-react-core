'use client'

import { useEffect, useMemo } from 'react'
import { useQuery, type UseQueryOptions, type UseQueryResult } from '@tanstack/react-query'
import { smartStoreApi } from '@/features/smartstore/api'
import { useAppDispatch } from '@/lib/redux/hooks'
import {
  setStoreInventory,
  updateInventoryStatus,
} from '@/features/smartstore/state/smartstore-slice'
import type { SmartStoreInventory } from '@/features/smartstore/types'
import type { SmartStoreInventoryRecord } from '@/features/smartstore/model'
import {
  SMART_STORE_QUERY_KEYS,
  SMART_STORE_QUERY_STATUS_MAP,
} from '@/features/smartstore/constants/query'

const toPlainInventories = (records: SmartStoreInventoryRecord[]): SmartStoreInventory[] =>
  records.map((record) => record.toPlain())

interface InventoryQueryOptions
  extends Omit<UseQueryOptions<SmartStoreInventoryRecord[]>, 'queryKey' | 'queryFn'> {}

export const useSmartStoreInventoryQuery = (
  storeId?: string,
  options?: InventoryQueryOptions,
): UseQueryResult<SmartStoreInventoryRecord[]> => {
  const dispatch = useAppDispatch()
  const { onSuccess, enabled = true, ...queryOptions } = options ?? {}

  const query = useQuery<SmartStoreInventoryRecord[]>({
    queryKey: SMART_STORE_QUERY_KEYS.inventory(storeId),
    queryFn: () => smartStoreApi.getSmartStoreInventory(storeId),
    enabled,
    staleTime: 1000 * 60,
    ...queryOptions,
  })

  const inventories = useMemo(
    () => (query.data ? toPlainInventories(query.data) : []),
    [query.data],
  )

  useEffect(() => {
    inventories.forEach((inventory) => dispatch(setStoreInventory(inventory)))
  }, [dispatch, inventories])

  useEffect(() => {
    if (!storeId) return
    dispatch(
      updateInventoryStatus({
        storeId,
        status: SMART_STORE_QUERY_STATUS_MAP[query.status],
      }),
    )
  }, [dispatch, query.status, storeId])

  return query
}
