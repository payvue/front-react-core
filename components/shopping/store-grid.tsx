'use client'

import type { StoreEntity } from '@/features/shopping/store/mock-store'
import { StoreSearchPanel } from '@/components/shopping/store-search-panel'
import { ShoppingMallList } from '@/components/shopping/shopping-mall-list'

interface StoreGridProps {
  stores: StoreEntity[]
  subscribedStores: StoreEntity[]
  onToggleSubscription: (storeId: string) => void
}

export function StoreGrid({ stores, subscribedStores, onToggleSubscription }: StoreGridProps) {
  return (
    <div className="space-y-6">
      <StoreSearchPanel stores={stores} onToggleSubscription={onToggleSubscription} />
      <ShoppingMallList stores={subscribedStores} onToggleSubscription={onToggleSubscription} />
    </div>
  )
}
