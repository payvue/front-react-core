'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { ShoppingTabConfig } from '../../types'

interface ShoppingTabsSectionProps {
  tabs: ShoppingTabConfig[]
  defaultValue?: string
}

export function ShoppingTabsSection({ tabs, defaultValue }: ShoppingTabsSectionProps) {
  if (!tabs.length) return null

  const resolvedDefault = defaultValue ?? tabs[0].key

  return (
    <Tabs defaultValue={resolvedDefault} className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.key} value={tab.key}>
            {tab.renderTrigger ? tab.renderTrigger() : tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.key} value={tab.key} className="space-y-6">
          {tab.renderContent()}
        </TabsContent>
      ))}
    </Tabs>
  )
}
