import type { SubscribedProduct } from '@/features/product/types'
import type { SmartStoreInfo } from '@/features/smartstore/types'

export interface ShoppingStats {
  stores: number
  subscribedStores: number
  totalProducts: number
  subscribedProductCount: number
}

export interface ShoppingPageContextValue {
  stores: SmartStoreInfo[]
  subscribedStores: SmartStoreInfo[]
  subscribedProducts: SubscribedProduct[]
  cartCount: number
  stats: ShoppingStats
  toggleSubscription: (storeId: string) => void
}
