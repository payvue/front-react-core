'use client'

import { ShoppingBag } from 'lucide-react'
import { SummaryCardHeaderList } from '@/shared/components/summary-card-header'
import {
  SmartStorePageLayout,
  StoreSelectorSection,
  StoreTabsSection,
} from '@/features/smartstore/components/layout'
import { ShoppingIntroSection } from '@/features/shopping/components/layout'
import { Card, CardContent } from '@/components/ui/card'
import { useSmartStoreTabs } from '@/features/smartstore/hooks/use-smartstore-tabs'
import {
  SmartStorePageProvider,
  useSmartStorePageContext,
} from '@/features/smartstore/context/online-smart-store'
import { useState } from 'react'

export default function SmartStorePage() {
  return (
    <SmartStorePageProvider>
      <SmartStorePageContent />
    </SmartStorePageProvider>
  )
}

function SmartStorePageContent() {
  const { stores, selectedStore, communityMembers, manager, summaryStat, setSelectedStoreId } =
    useSmartStorePageContext()

  const [activeTab, setActiveTab] = useState('overview')

  const tabsConfig = useSmartStoreTabs({
    store: selectedStore,
    communityName: selectedStore?.communityName,
    communityMembers,
    manager,
    activeTab,
  })

  return (
    <SmartStorePageLayout
      renderIntro={() => (
        <ShoppingIntroSection
          title="스토어 운영 센터"
          description="참여 중인 커뮤니티 스토어를 전환하며 상품을 등록하고 관리하세요"
          icon={<ShoppingBag className="h-8 w-8 text-primary" />}
        />
      )}
      renderStats={() => (
        <SummaryCardHeaderList items={summaryStat} gridClassName="grid-cols-1 md:grid-cols-4" />
      )}
      renderSections={[
        () => (
          <StoreSelectorSection
            stores={stores}
            selectedStoreId={selectedStore?.id}
            onSelect={setSelectedStoreId}
          />
        ),
        () => (
          <StoreTabsSection
            activeTab={activeTab}
            onChangeTab={setActiveTab}
            tabs={tabsConfig}
            emptyState={
              <Card>
                <CardContent className="py-12 text-center space-y-4">
                  <p className="text-lg font-semibold">선택된 스토어가 없습니다</p>
                  <p className="text-sm text-muted-foreground">
                    상단의 선택 영역에서 스토어를 선택해 주세요
                  </p>
                </CardContent>
              </Card>
            }
          />
        ),
      ]}
    />
  )
}
