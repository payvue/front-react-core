'use client'

import { useMemo } from 'react'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/features/cart/hooks'
import {
  ShoppingIntroSection,
  ShoppingPageLayout,
  ShoppingStatsSection,
  ShoppingTabsSection,
} from '@/features/shopping/components/layout'
import type { ShoppingPageContextValue } from '@/features/shopping/types'
import { useShoppingSummary } from '@/features/shopping/hooks/use-shopping-summary'
import { useShoppingTabs } from '@/features/shopping/hooks/use-shopping-tabs'
import { useOnlineSmartStores } from '@/features/smartstore/hooks/use-online-smart-stores'
import { useSmartStoreInfoQuery } from '@/features/smartstore/hooks/queries'
import { useSubscribedStoreInventories } from '@/features/product/hooks/use-subscribed-store-inventories'

export default function ShoppingPage() {
  useSmartStoreInfoQuery()
  const { stores, subscribedStores, subscribedProducts, stats, toggleSubscription } =
    useOnlineSmartStores()

  useSubscribedStoreInventories({ subscribedStores })
  const { count: cartCount } = useCart()

  const shoppingSummaryItems = useShoppingSummary({ stats })

  const contextValue = useMemo<ShoppingPageContextValue>(
    () => ({
      stores,
      subscribedStores,
      subscribedProducts,
      cartCount,
      stats,
      toggleSubscription,
    }),
    [stores, subscribedStores, subscribedProducts, cartCount, stats, toggleSubscription],
  )

  const tabConfigs = useShoppingTabs({ cartCount })

  return (
    <ShoppingPageLayout
      contextValue={contextValue}
      renderIntro={() => (
        <ShoppingIntroSection
          title="PayEasy 쇼핑"
          description="구독한 쇼핑몰의 상품을 한 곳에서 확인하고 결제하세요"
          icon={<ShoppingBag className="h-8 w-8 text-primary" />}
        />
      )}
      renderStats={() => <ShoppingStatsSection items={shoppingSummaryItems} />}
      renderSections={[() => <ShoppingTabsSection tabs={tabConfigs} defaultValue="products" />]}
    />
  )
}
