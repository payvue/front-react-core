import { useQuery, UseQueryResult } from '@tanstack/react-query'
import type { Method } from 'axios'
import request from '@/lib/api/client'
import APIResponse from '@/lib/api/types/response'
import { GroupTransactionSchema } from '../types/group'
import { normalizeGroupTransactions } from '../utils/group-normalizer'

const GROUP_TRANSACTION_ENDPOINT = '/transaction/query/community'
export const GROUP_TRANSACTION_QUERY_KEY = ['transaction', 'group'] as const

export const useGroupTransactionsQuery = (
  groupId: string,
): UseQueryResult<GroupTransactionSchema[]> => {
  return useQuery<GroupTransactionSchema[]>({
    queryKey: [...GROUP_TRANSACTION_QUERY_KEY, groupId],
    queryFn: async () => {
      const response = (await request({
        method: 'GET' as Method,
        url: `${GROUP_TRANSACTION_ENDPOINT}/${groupId}`,
      })) as APIResponse<{ items?: GroupTransactionSchema[] }>

      return normalizeGroupTransactions(response.data?.items ?? [])
    },
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    enabled: Boolean(groupId),
  })
}
