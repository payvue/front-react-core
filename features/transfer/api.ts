import request from '@/lib/api/client'
import { REQUEST_URL } from '@/constants'
import type APIResponse from '@/lib/api/types/response'
import { Method } from 'axios'

export interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  status?: string
}

export interface TransferRequest {
  recipientId: string
  recipientType: 'USER' | 'COMMUNITY'
  amount: number
  currency?: string
  message?: string
  clientRequestId?: string
}

export interface TransferResponse {
  transferId: string
  status: 'pending' | 'completed' | 'failed'
  balance?: number
}

const getProfileByEmail = async (email: string) => {
  return request({
    method: 'GET' as Method,
    url: REQUEST_URL.PRIVATE.USER_PROFILE,
    params: { email },
  }) as Promise<APIResponse<UserProfile>>
}

const createCashTransfer = async (payload: TransferRequest) => {
  const headers: Record<string, string> = {}
  if (payload.clientRequestId) headers['Idempotency-Key'] = payload.clientRequestId

  return request({
    method: 'POST' as Method,
    url: REQUEST_URL.PRIVATE.TRANSFER_CASH,
    data: payload,
    headers,
  }) as Promise<APIResponse<TransferResponse>>
}

const getTransferHistory = async (
  assetType?: string,
  txType?: string,
  params: Record<string, unknown> = {},
) => {
  const url =
    assetType && txType
      ? `${REQUEST_URL.PRIVATE.TRANSFER_HISTORY}/${encodeURIComponent(assetType)}/${encodeURIComponent(txType)}`
      : REQUEST_URL.PRIVATE.TRANSFER_HISTORY

  return request({
    method: 'GET' as Method,
    url,
    params,
  }) as Promise<APIResponse<{ items: TransferResponse[]; pagination?: any }>>
}

export default {
  getProfileByEmail,
  createCashTransfer,
  getTransferHistory,
}
