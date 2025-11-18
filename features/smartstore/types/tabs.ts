import type { StoreTabConfig } from '@/features/smartstore/components/layout'
import type { SmartStoreInfo, SmartStoreMember } from './store'
import type { ReactNode } from 'react'

export interface StoreTabConfig {
  key: string
  label: string
  content: ReactNode
}

export interface SmartStoreTabConfigParams {
  store: SmartStoreInfo
  communityName?: string
  communityMembers: SmartStoreMember[]
  manager?: SmartStoreMember
  activeTab: string
}

export interface SmartStoreTabConfigService {
  getConfigs(params: SmartStoreTabConfigParams): StoreTabConfig[]
}
