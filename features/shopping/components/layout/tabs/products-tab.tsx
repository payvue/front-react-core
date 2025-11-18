'use client'

import { useMemo } from 'react'
import { useShoppingPageContext } from '@/features/shopping/context'
import { useCart } from '@/features/cart/hooks'
import { ProductGrid } from '@/features/shopping/components/product/product-grid'
import { Badge } from '@/components/ui/badge'

export function ProductsTab() {
  const { stores, subscribedProducts } = useShoppingPageContext()
  const { addItem } = useCart()

  const subscribedStoreBadges = useMemo(
    () => stores.filter((store) => store.isSubscribed),
    [stores],
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">추천 상품</h2>
        <div className="flex gap-2">
          {subscribedStoreBadges.map((store) => (
            <Badge key={store.id} variant="secondary" className="text-xs">
              {store.name}
            </Badge>
          ))}
        </div>
      </div>
      <ProductGrid products={subscribedProducts} onAddToCart={(product) => addItem(product)} />
    </div>
  )
}
