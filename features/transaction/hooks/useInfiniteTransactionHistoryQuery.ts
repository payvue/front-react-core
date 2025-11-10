import { useInfiniteQuery, UseInfiniteQueryResult } from '@tanstack/react-query'
import type { Method } from 'axios'
import request from '@/lib/api/client'
import APIResponse from '@/lib/api/types/response'
import { HistoryTransactionSchema } from '../types'
import { normalizeHistoryTransactions } from '../utils/history-normalizer'

const TRANSACTION_HISTORY_ENDPOINT = '/transaction/history'

export interface InfiniteTransactionHistoryParams {
  pageSize?: number
}

const fetchTransactionHistoryPage = async (
  page: number,
  pageSize: number,
): Promise<HistoryTransactionSchema[]> => {
  const response = (await request({
    method: 'GET' as Method,
    url: TRANSACTION_HISTORY_ENDPOINT,
    params: {
      page,
      limit: pageSize,
    },
  })) as APIResponse<HistoryTransactionSchema[]>

  return normalizeHistoryTransactions(response.data)
}

export const useInfiniteTransactionHistoryQuery = (
  params: InfiniteTransactionHistoryParams = {},
): UseInfiniteQueryResult<HistoryTransactionSchema[]> => {
  const pageSize = params.pageSize ?? 20

  return useInfiniteQuery<HistoryTransactionSchema[]>({
    queryKey: ['transaction', 'history', 'infinite', pageSize],
    queryFn: ({ pageParam = 1 }) => fetchTransactionHistoryPage(Number(pageParam), pageSize),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const hasMore = lastPage.length === pageSize
      return hasMore ? allPages.length + 1 : undefined
    },
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  })
}
