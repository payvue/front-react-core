'use client'

import { useMemo } from 'react'
import type { SummaryCardItem } from '@/shared/components/summary-card-header'
import type { ShoppingStats, ShoppingSummaryService } from '@/features/shopping/types'
import { defaultShoppingSummaryService } from '@/features/shopping/config/summary-service'

interface UseShoppingSummaryOptions {
  stats: ShoppingStats
  service?: ShoppingSummaryService
}

export const useShoppingSummary = ({
  stats,
  service = defaultShoppingSummaryService,
}: UseShoppingSummaryOptions): SummaryCardItem[] => {
  return useMemo(() => service.getSummaryItems(stats), [service, stats])
}
