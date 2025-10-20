export type OnlineAssetCategory = 'game' | 'music' | 'gift' | 'shopping' | 'cash' | 'mileage'

export enum OnlineAssetCategoryEnum {
  GAME = "game",
  MUSIC = "music",
  GIFT = "gift",
  SHOPPING = "shopping",
  CASH = "cash",
  MILEAGE = "mileage",
}

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


type BadgeVariant = "default" | "secondary" | "destructive" | "outline"

interface StatusMeta {
  label: string
  variant: BadgeVariant
  className?: string
}