'use client'

import { Heart } from 'lucide-react'
import { CartTab, MallsTab, ProductsTab } from '@/features/shopping/components/layout'
import type {
  ShoppingTabConfig,
  ShoppingTabConfigParams,
  ShoppingTabConfigService,
} from '@/features/shopping/types'

class DefaultShoppingTabConfigService implements ShoppingTabConfigService {
  getConfigs({ cartCount }: ShoppingTabConfigParams): ShoppingTabConfig[] {
    return [
      {
        key: 'products',
        label: '상품 목록',
        renderContent: () => <ProductsTab />,
      },
      {
        key: 'shoppingcart',
        label: '장바구니',
        renderTrigger: () => (
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center">
              <Heart className="h-5 w-5 text-muted-foreground" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex min-w-[1rem] h-[1rem] items-center justify-center rounded-full bg-red-500 px-[0.3rem] py-[0.1rem] text-[10px] font-semibold text-white shadow-sm">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </div>
            장바구니
          </div>
        ),
        renderContent: () => <CartTab />,
      },
      {
        key: 'malls',
        label: '쇼핑몰',
        renderContent: () => <MallsTab />,
      },
    ]
  }
}

export const defaultShoppingTabConfigService = new DefaultShoppingTabConfigService()

export { DefaultShoppingTabConfigService }
