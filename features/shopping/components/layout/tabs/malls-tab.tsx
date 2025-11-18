'use client'

import { useShoppingPageContext } from '@/features/shopping/context'
import { StoreGrid } from '@/components/shopping/store-grid'

export function MallsTab() {
  const { stores, subscribedStores, toggleSubscription } = useShoppingPageContext()

  return (
    <StoreGrid
      stores={stores}
      subscribedStores={subscribedStores}
      onToggleSubscription={toggleSubscription}
    />
  )
}
