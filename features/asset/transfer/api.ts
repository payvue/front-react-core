import request from '@/lib/api/client'
import { REQUEST_URL } from '@/constants'
import type APIResponse from '@/lib/api/types/response'
import { Method } from 'axios'

export interface AssetTransferUserRequest {
  assetId: string
  recipientEmail: string
  message?: string
  clientRequestId?: string
}

export interface AssetTransferCommunityRequest {
  assetId: string
  groupId: string
  message?: string
  clientRequestId?: string
}

export interface AssetTransferResponse {
  transferId: string
  status: 'completed' | 'pending' | 'failed'
  assetId?: string
  assetType: string
  recipientEmail?: string
  groupId?: string
  message?: string
  timestamp: string
}

const transferAssetToUser = async (assetType: string, payload: AssetTransferUserRequest) => {
  const headers: Record<string, string> = {}
  if (payload.clientRequestId) {
    headers['Idempotency-Key'] = payload.clientRequestId
  }

  return request({
    method: 'POST' as Method,
    url: `${REQUEST_URL.PRIVATE.ASSET_TRANSFER_USER}/${encodeURIComponent(assetType)}`,
    data: payload,
    headers,
  }) as Promise<APIResponse<AssetTransferResponse>>
}

const transferAssetToCommunity = async (
  assetType: string,
  payload: AssetTransferCommunityRequest,
) => {
  const headers: Record<string, string> = {}
  if (payload.clientRequestId) {
    headers['Idempotency-Key'] = payload.clientRequestId
  }

  return request({
    method: 'POST' as Method,
    url: `${REQUEST_URL.PRIVATE.ASSET_TRANSFER_COMMUNITY}/${encodeURIComponent(assetType)}`,
    data: payload,
    headers,
  }) as Promise<APIResponse<AssetTransferResponse>>
}

export default {
  transferAssetToUser,
  transferAssetToCommunity,
}
