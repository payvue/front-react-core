import { REQUEST_URL } from '@/constants'
import request from '@/lib/api/client'
import APIResponse from '@/lib/api/types/response'
import type { CommunityCreatePayload } from './types'
import { Method } from 'axios'

interface PaymentRequestCreate {
  amount: number
  description: string
  category: string
  urgency: 'low' | 'medium' | 'high'
}

interface PaymentRequest {
  id: string
  requesterId: string
  requesterName: string
  requesterAvatar?: string
  groupId: string
  amount: number
  description: string
  category: string
  requestDate: string
  status: 'pending' | 'approved' | 'rejected'
  approvedDate?: string
  rejectedDate?: string
  rejectionReason?: string
  urgency: 'low' | 'medium' | 'high'
}

interface CommunityAPI {
  create: (
    data: CommunityCreatePayload,
  ) => Promise<APIResponse<{ id?: string; communityId?: string }>>
  info: () => Promise<APIResponse>
  invite: ({ id, emails }: { id: string; emails: string[] }) => Promise<APIResponse>
  createPaymentRequest: (groupId: string, data: PaymentRequestCreate) => Promise<APIResponse>
  getPaymentRequests: (groupId: string) => Promise<APIResponse<PaymentRequest[]>>
  getMyPaymentRequests: (communityId: string) => Promise<APIResponse<PaymentRequest[]>>
  approvePaymentRequest: (requestId: string) => Promise<APIResponse>
  rejectPaymentRequest: (requestId: string, rejectionReason: string) => Promise<APIResponse>
}

const useCommunityAPI = (): CommunityAPI => {
  const create = async (data: CommunityCreatePayload) => {
    return request({
      method: 'POST' as Method,
      url: REQUEST_URL.PRIVATE.CREATE_COMMUNITYINFO,
      data,
    })
  }

  const info = async () => {
    return request({
      method: 'GET' as Method,
      url: REQUEST_URL.PRIVATE.COMMUNITYINFO,
    })
  }

  const invite = async ({ id, emails }: { id: string; emails: string[] }) => {
    return request({
      method: 'POST' as Method,
      url: `${REQUEST_URL.PRIVATE.INVITE_FOLLOWER}/${id}`,
      data: emails,
    })
  }

  const createPaymentRequest = async (groupId: string, data: PaymentRequestCreate) => {
    return request({
      method: 'POST' as Method,
      url: REQUEST_URL.PRIVATE.PAYMENT_REQUEST_CREATE.replace('{groupId}', groupId),
      params: {
        category: 'cooperative',
      },
      data,
    })
  }

  const getPaymentRequests = async (groupId: string) => {
    return request({
      method: 'GET' as Method,
      url: REQUEST_URL.PRIVATE.PAYMENT_REQUEST_LIST.replace('{groupId}', groupId),
      params: {
        category: 'cooperative',
      },
    })
  }

  const getMyPaymentRequests = async (communityId: string) => {
    return request({
      method: 'GET' as Method,
      url: REQUEST_URL.PRIVATE.PAYMENT_REQUEST_MY,
      params: {
        communityId,
        category: 'cooperative',
      },
    })
  }

  const approvePaymentRequest = async (requestId: string) => {
    return request({
      method: 'PUT' as Method,
      url: REQUEST_URL.PRIVATE.PAYMENT_REQUEST_APPROVE.replace('{requestId}', requestId),
      params: {
        communityCategory: 'cooperative',
      },
    })
  }

  const rejectPaymentRequest = async (requestId: string, rejectionReason: string) => {
    return request({
      method: 'PUT' as Method,
      url: REQUEST_URL.PRIVATE.PAYMENT_REQUEST_REJECT.replace('{requestId}', requestId),
      params: {
        category: 'cooperative',
      },
      data: { rejectionReason },
    })
  }

  return {
    create,
    info,
    invite,
    createPaymentRequest,
    getPaymentRequests,
    getMyPaymentRequests,
    approvePaymentRequest,
    rejectPaymentRequest,
  }
}

export default useCommunityAPI
