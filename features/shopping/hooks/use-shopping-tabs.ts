'use client'

import { useMemo } from 'react'
import type { ShoppingTabConfig, ShoppingTabConfigService } from '@/features/shopping/types'
import { defaultShoppingTabConfigService } from '@/features/shopping/config/tab-config-service'

interface UseShoppingTabsOptions {
  cartCount: number
  service?: ShoppingTabConfigService
}

export const useShoppingTabs = ({
  cartCount,
  service = defaultShoppingTabConfigService,
}: UseShoppingTabsOptions): ShoppingTabConfig[] => {
  return useMemo(() => service.getConfigs({ cartCount }), [service, cartCount])
}
