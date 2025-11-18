import type { ReactNode } from 'react'

export interface ShoppingTabConfig {
  key: string
  label: string
  renderContent: () => ReactNode
  renderTrigger?: () => ReactNode
}

export interface ShoppingTabConfigParams {
  cartCount: number
}

export interface ShoppingTabConfigService {
  getConfigs: (params: ShoppingTabConfigParams) => ShoppingTabConfig[]
}
