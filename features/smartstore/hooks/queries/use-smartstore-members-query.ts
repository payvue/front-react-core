'use client'

import { useEffect, useMemo } from 'react'
import { useQuery, type UseQueryOptions, type UseQueryResult } from '@tanstack/react-query'
import { smartStoreApi } from '@/features/smartstore/api'
import { useAppDispatch } from '@/lib/redux/hooks'
import { setStoreCommunityProfile, updateMembersStatus } from '@/features/smartstore/state/smartstore-slice'
import type { SmartStoreCommunityProfile } from '@/features/smartstore/types'
import type { SmartStoreCommunityProfileRecord } from '@/features/smartstore/model'
import { SMART_STORE_QUERY_KEYS, SMART_STORE_QUERY_STATUS_MAP } from '@/features/smartstore/constants/query'

const toPlainProfiles = (
  records: SmartStoreCommunityProfileRecord[],
): SmartStoreCommunityProfile[] => records.map((record) => record.toPlain())

interface MembersQueryOptions
  extends Omit<UseQueryOptions<SmartStoreCommunityProfileRecord[]>, 'queryKey' | 'queryFn'> {}

export const useSmartStoreMembersQuery = (
  storeId?: string,
  options?: MembersQueryOptions,
): UseQueryResult<SmartStoreCommunityProfileRecord[]> => {
  const dispatch = useAppDispatch()
  const { onSuccess, enabled = true, ...queryOptions } = options ?? {}

  const query = useQuery<SmartStoreCommunityProfileRecord[]>({
    queryKey: SMART_STORE_QUERY_KEYS.members(storeId),
    queryFn: () => smartStoreApi.getSmartStoreMembers(storeId),
    enabled,
    staleTime: 1000 * 60,
    ...queryOptions,
  })

  const plainProfiles = useMemo(
    () => (query.data ? toPlainProfiles(query.data) : []),
    [query.data],
  )

  useEffect(() => {
    if (!storeId || !query.data?.length) return
    plainProfiles.forEach((profile) => dispatch(setStoreCommunityProfile(profile)))
    onSuccess?.(query.data)
  }, [dispatch, storeId, plainProfiles, query.data, onSuccess])

  useEffect(() => {
    if (!storeId) return
    dispatch(
      updateMembersStatus({
        storeId,
        status: SMART_STORE_QUERY_STATUS_MAP[query.status],
      }),
    )
  }, [dispatch, query.status, storeId])

  return query
}
