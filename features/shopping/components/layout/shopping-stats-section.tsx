'use client'

import type { SummaryCardItem } from '@/shared/components/summary-card-header'
import { SummaryCardHeaderList } from '@/shared/components/summary-card-header'

interface ShoppingStatsSectionProps {
  items: SummaryCardItem[]
}

export function ShoppingStatsSection({ items }: ShoppingStatsSectionProps) {
  return (
    <SummaryCardHeaderList
      items={items}
      gridClassName="grid-cols-1 md:grid-cols-3"
      className="mb-8"
    />
  )
}
