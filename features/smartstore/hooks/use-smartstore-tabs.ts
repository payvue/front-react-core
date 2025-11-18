'use client'

import { useMemo } from 'react'
import type { StoreTabConfig } from '@/features/smartstore/components/layout'
import type {
  SmartStoreInfo,
  SmartStoreMember,
  SmartStoreTabConfigService,
} from '@/features/smartstore/types'
import { defaultSmartStoreTabConfigService } from '@/features/smartstore/config/tab-config-service'

interface UseSmartStoreTabsOptions {
  store: SmartStoreInfo | null
  communityName?: string
  communityMembers: SmartStoreMember[]
  manager?: SmartStoreMember
  activeTab: string
  service?: SmartStoreTabConfigService
}

export const useSmartStoreTabs = ({
  store,
  communityName,
  communityMembers,
  manager,
  activeTab,
  service = defaultSmartStoreTabConfigService,
}: UseSmartStoreTabsOptions): StoreTabConfig[] => {
  return useMemo(() => {
    if (!store) return []
    return service.getConfigs({
      store,
      communityName,
      communityMembers,
      manager,
      activeTab,
    })
  }, [store, communityName, communityMembers, manager, activeTab, service])
}
