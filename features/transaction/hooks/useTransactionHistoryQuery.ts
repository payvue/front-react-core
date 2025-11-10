import { useQuery, UseQueryResult } from '@tanstack/react-query'
import type { Method } from 'axios'
import request from '@/lib/api/client'
import APIResponse from '@/lib/api/types/response'
import { HistoryTransactionSchema } from '../types'
import { normalizeHistoryTransactions } from '../utils/history-normalizer'

const TRANSACTION_HISTORY_ENDPOINT = '/transaction/history'
export const TRANSACTION_HISTORY_QUERY_KEY = ['transaction', 'history'] as const

export interface TransactionHistoryParams {
  count?: number
}

const fetchTransactionHistory = async (params: TransactionHistoryParams) => {
  const response = (await request({
    method: 'GET' as Method,
    url: TRANSACTION_HISTORY_ENDPOINT,
    params,
  })) as APIResponse<HistoryTransactionSchema[]>

  return normalizeHistoryTransactions(response.data)
}

export const useTransactionHistoryQuery = (
  params: TransactionHistoryParams = { count: 10 },
): UseQueryResult<HistoryTransactionSchema[]> => {
  const queryKey = [...TRANSACTION_HISTORY_QUERY_KEY, params.count ?? 10]

  return useQuery<HistoryTransactionSchema[]>({
    queryKey,
    queryFn: () => fetchTransactionHistory(params),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  })
}
