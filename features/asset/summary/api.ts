import request from '@/lib/api/client'
import { REQUEST_URL } from '@/constants'
import type APIResponse from '@/lib/api/types/response'
import { Method } from 'axios'

export interface CreateOnlineAssetPayload {
  name: string
  category: 'game' | 'music' | 'gift' | 'shopping'
  amount: number
  description?: string
  status?: 'active' | 'used' | 'expired'
}

export const createOnlineAsset = async (payload: CreateOnlineAssetPayload) => {
  return request({
    method: 'POST' as Method,
    url: REQUEST_URL.PRIVATE.ASSET_ONLINE_CREATE,
    data: payload,
  }) as Promise<APIResponse>
}
