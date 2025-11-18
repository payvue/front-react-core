'use client'

import type { ReactNode } from 'react'
import type { StoreTabConfig } from '@/features/smartstore/components/layout'
import { StoreOverviewTab, StoreProductsTab } from '@/features/smartstore/components/layout'
import type {
  SmartStoreInfo,
  SmartStoreMember,
  SmartStoreTabConfigParams,
  SmartStoreTabConfigService,
} from '@/features/smartstore/types'

class DefaultSmartStoreTabConfigService implements SmartStoreTabConfigService {
  getConfigs({
    store,
    communityName,
    communityMembers,
    manager,
    activeTab,
  }: SmartStoreTabConfigParams): StoreTabConfig[] {
    const tabs: StoreTabConfig[] = [
      {
        key: 'overview',
        label: '스토어 정보',
        content: this.renderOverviewTab(store, communityName, communityMembers, manager),
      },
      {
        key: 'products',
        label: '상품 관리',
        content: this.renderProductsTab(activeTab),
      },
    ]

    return tabs
  }

  private renderOverviewTab(
    store: SmartStoreInfo,
    communityName: string | undefined,
    members: SmartStoreMember[],
    manager: SmartStoreMember | undefined,
  ): ReactNode {
    return (
      <StoreOverviewTab
        store={store}
        communityName={communityName}
        members={members}
        manager={manager}
      />
    )
  }

  private renderProductsTab(activeTab: string): ReactNode {
    return <StoreProductsTab activeTab={activeTab} />
  }
}

export const defaultSmartStoreTabConfigService = new DefaultSmartStoreTabConfigService()

export type { SmartStoreTabConfigParams }
