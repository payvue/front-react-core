import { useQuery, UseQueryResult } from '@tanstack/react-query'
import type { Method } from 'axios'
import request from '@/lib/api/client'
import APIResponse from '@/lib/api/types/response'
import { AssetTransactionSchema } from '../types'
import { normalizeAssetTransactions } from '../utils/asset-normalizer'
import { REQUEST_URL } from '@/constants'

export const ASSET_TRANSACTION_QUERY_KEY = ['transaction', 'asset'] as const

export const useAssetTransactionsQuery = (): UseQueryResult<AssetTransactionSchema[]> => {
  return useQuery<AssetTransactionSchema[]>({
    queryKey: ASSET_TRANSACTION_QUERY_KEY,
    queryFn: async () => {
      const response = (await request({
        method: 'GET' as Method,
        url: REQUEST_URL.PRIVATE.TRANSACTION_PERSONAL_ASSET,
      })) as APIResponse<{ items?: AssetTransactionSchema[] }>

      return normalizeAssetTransactions(response.data?.items ?? [])
    },
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  })
}
