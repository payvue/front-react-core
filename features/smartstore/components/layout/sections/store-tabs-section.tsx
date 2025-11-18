'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import type { ReactNode } from 'react'
import type { StoreTabConfig } from '@/features/smartstore/types'

interface StoreTabsSectionProps {
  activeTab: string
  onChangeTab: (value: string) => void
  tabs: StoreTabConfig[]
  emptyState?: ReactNode
}

export function StoreTabsSection({
  activeTab,
  onChangeTab,
  tabs,
  emptyState,
}: StoreTabsSectionProps) {
  if (!tabs.length) {
    return (
      emptyState ?? (
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <p className="text-lg font-semibold">참여 중인 스토어가 없습니다</p>
            <p className="text-sm text-muted-foreground">
              커뮤니티에서 스토어를 개설하면 이곳에서 모든 상품을 관리할 수 있습니다
            </p>
          </CardContent>
        </Card>
      )
    )
  }

  return (
    <Tabs value={activeTab} onValueChange={onChangeTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.key} value={tab.key}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.key} value={tab.key} className="space-y-6">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
