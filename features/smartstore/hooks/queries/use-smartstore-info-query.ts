'use client'

import { useEffect, useMemo } from 'react'
import { useQuery, type UseQueryOptions, type UseQueryResult } from '@tanstack/react-query'
import { smartStoreApi } from '@/features/smartstore/api'
import { useAppDispatch } from '@/lib/redux/hooks'
import { setStoreList, updateInfoStatus } from '@/features/smartstore/state/smartstore-slice'
import type { SmartStoreInfo } from '@/features/smartstore/types'
import type { SmartStoreInfoRecord } from '@/features/smartstore/model'
import {
  SMART_STORE_QUERY_KEYS,
  SMART_STORE_QUERY_STATUS_MAP,
} from '@/features/smartstore/constants/query'

const toPlainStores = (records: SmartStoreInfoRecord[]): SmartStoreInfo[] =>
  records.map((record) => record.toPlain())

export const useSmartStoreInfoQuery = (
  options?: UseQueryOptions<SmartStoreInfoRecord[]>,
): UseQueryResult<SmartStoreInfoRecord[]> => {
  const dispatch = useAppDispatch()
  const { onSuccess, ...queryOptions } = options ?? {}

  const query = useQuery<SmartStoreInfoRecord[]>({
    queryKey: SMART_STORE_QUERY_KEYS.info(),
    queryFn: () => smartStoreApi.getSmartStoreInfo(),
    staleTime: 1000 * 60,
    ...queryOptions,
  })

  const plainStores = useMemo(() => (query.data ? toPlainStores(query.data) : []), [query.data])

  useEffect(() => {
    if (!query.data?.length) return
    dispatch(setStoreList(plainStores))
    onSuccess?.(query.data)
  }, [dispatch, plainStores, query.data])

  useEffect(() => {
    dispatch(updateInfoStatus(SMART_STORE_QUERY_STATUS_MAP[query.status]))
  }, [dispatch, query.status])

  return query
}
