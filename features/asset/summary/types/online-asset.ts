export type OnlineAssetCategory = 'game' | 'music' | 'gift' | 'shopping' | 'cash' | 'mileage'

export type OnlineAssetStatus = 'active' | 'used' | 'expired'

export interface OnlineAssetSchema {
  id: string
  name: string
  category: OnlineAssetCategory
  amount: number
  purchaseDate: string
  status: OnlineAssetStatus
  balance?: number
  description?: string
}
