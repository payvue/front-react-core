'use client'

import type { Method } from 'axios'
import request from '@/lib/api/client'
import APIResponse from '@/lib/api/types/response'
import type {
  SmartStoreCommunityProfile,
  SmartStoreInfo,
  SmartStoreInventory,
} from '@/features/smartstore/types'
import { SmartStoreCommunityProfileRecord, SmartStoreInfoRecord } from '@/features/smartstore/model'
import { SmartStoreInventoryRecord } from '@/features/smartstore/model'

const SMART_STORE_INFO_ENDPOINT = '/smartstore/info'
const SMART_STORE_MEMBER_ENDPOINT = '/smartstore/member'
const SMART_STORE_INVENTORY_ENDPOINT = '/smartstore/inventory'

type SmartStoreInfoResponse = APIResponse<SmartStoreInfo | SmartStoreInfo[]>
type SmartStoreMembersResponse = APIResponse<
  SmartStoreCommunityProfile | SmartStoreCommunityProfile[]
>
type SmartStoreInventoryResponse = APIResponse<SmartStoreInventory | SmartStoreInventory[]>

const buildUrl = (base: string, storeId?: string) => (storeId ? `${base}/${storeId}` : base)

const normalizeArray = <T>(payload?: T | T[]): T[] => {
  if (!payload) return []
  return Array.isArray(payload) ? payload : [payload]
}

export const smartStoreApi = {
  async getSmartStoreInfo(storeId?: string): Promise<SmartStoreInfoRecord[]> {
    const response = (await request({
      method: 'GET' as Method,
      url: buildUrl(SMART_STORE_INFO_ENDPOINT, storeId),
    })) as SmartStoreInfoResponse

    return normalizeArray(response.data).map((item) => new SmartStoreInfoRecord(item))
  },

  async getSmartStoreMembers(storeId?: string): Promise<SmartStoreCommunityProfileRecord[]> {
    const response = (await request({
      method: 'GET' as Method,
      url: buildUrl(SMART_STORE_MEMBER_ENDPOINT, storeId),
    })) as SmartStoreMembersResponse

    return normalizeArray(response.data).map((item) => new SmartStoreCommunityProfileRecord(item))
  },

  async getSmartStoreInventory(storeId?: string): Promise<SmartStoreInventoryRecord[]> {
    const response = (await request({
      method: 'GET' as Method,
      url: buildUrl(SMART_STORE_INVENTORY_ENDPOINT, storeId),
    })) as SmartStoreInventoryResponse

    return normalizeArray(response.data).map((item) => new SmartStoreInventoryRecord(item))
  },
}
