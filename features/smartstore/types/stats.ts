export interface SmartStoreStats {
  stores: number
  subscribedStores: number
  totalProducts: number
  subscribedProductCount: number
}

export interface SmartStoreOverviewStats {
  storeCount: number
  productCount: number
  subscriberCount: number
  averageRating: string
}

export interface SmartStoreSummaryItem {
  key: string
  title: string
  value: string | number
  valueDescription?: string
}
