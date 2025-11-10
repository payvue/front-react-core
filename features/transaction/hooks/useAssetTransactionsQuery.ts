import { useQuery, UseQueryResult } from '@tanstack/react-query'
import type { Method } from 'axios'
import request from '@/lib/api/client'
import APIResponse from '@/lib/api/types/response'
import { AssetTransactionSchema } from '../types'
import { normalizeAssetTransactions } from '../utils/asset-normalizer'

const ASSET_TRANSACTION_ENDPOINT = '/transaction/asset'
export const ASSET_TRANSACTION_QUERY_KEY = ['transaction', 'asset'] as const

export const useAssetTransactionsQuery = (): UseQueryResult<AssetTransactionSchema[]> => {
  return useQuery<AssetTransactionSchema[]>({
    queryKey: ASSET_TRANSACTION_QUERY_KEY,
    queryFn: async () => {
      const response = (await request({
        method: 'GET' as Method,
        url: ASSET_TRANSACTION_ENDPOINT,
      })) as APIResponse<AssetTransactionSchema[]>

      return normalizeAssetTransactions(response.data)
    },
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  })
}
