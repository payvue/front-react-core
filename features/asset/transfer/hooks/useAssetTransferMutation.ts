'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import assetTransferAPI, { AssetTransferUserRequest, AssetTransferCommunityRequest } from '../api'
import { ONLINE_ASSET_QUERY_KEY } from '../../summary/hooks/useOnlineAssetsQuery'
import { ASSET_SUMMARY_QUERY_KEY } from '../../summary/hooks/useAssetSummaryQuery'

const generateIdempotencyKey = () => {
  if (
    typeof globalThis !== 'undefined' &&
    (globalThis as any).crypto &&
    typeof (globalThis as any).crypto.randomUUID === 'function'
  ) {
    return (globalThis as any).crypto.randomUUID()
  }
  return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36)
}

const mapAssetType = (assetType: string) => {
  switch (assetType) {
    case 'cash':
      return 'cash'
    case 'mileage':
      return 'point'
    case 'gift':
      return 'gift_card'
    case 'music':
      return 'subscription'
    case 'game':
    case 'shopping':
      return 'coupon'
    default:
      return 'all'
  }
}

export const useTransferAssetToUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      assetType,
      payload,
    }: {
      assetType: string
      payload: AssetTransferUserRequest
    }) => {
      const body = { ...payload }
      if (!body.clientRequestId) {
        body.clientRequestId = generateIdempotencyKey()
      }
      return assetTransferAPI.transferAssetToUser(mapAssetType(assetType), body)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ONLINE_ASSET_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ASSET_SUMMARY_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ['transaction', 'history'] })
    },
  })
}

export const useTransferAssetToCommunity = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      assetType,
      payload,
    }: {
      assetType: string
      payload: AssetTransferCommunityRequest
    }) => {
      const body = { ...payload }
      if (!body.clientRequestId) {
        body.clientRequestId = generateIdempotencyKey()
      }
      return assetTransferAPI.transferAssetToCommunity(mapAssetType(assetType), body)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ONLINE_ASSET_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ASSET_SUMMARY_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ['transaction', 'history'] })
      queryClient.invalidateQueries({ queryKey: ['community'] })
    },
  })
}
