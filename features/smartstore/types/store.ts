import type { StoreInventoryProduct } from '@/features/product/types'

export interface SmartStoreMember {
  id: string
  name: string
  role: string
  avatar: string
}

export interface SmartStoreInfo {
  id: string
  name: string
  description: string
  rating: number
  subscribers: number
  monthlyVolume: number
  communityId: string
  managerId: string
  isSubscribed?: boolean
  summary?: string
  products: StoreInventoryProduct[]
}

export interface SmartStoreCommunityProfile {
  storeId: string
  members: SmartStoreMember[]
}

export interface SmartStoreInventory {
  storeId: string
  products: StoreInventoryProduct[]
}

export type StoreProductDraft = Omit<StoreInventoryProduct, 'id'>
