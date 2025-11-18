import type { SummaryCardItem } from '@/shared/components/summary-card-header'
import type { ShoppingStats } from './context'

export interface ShoppingSummaryService {
  getSummaryItems: (stats: ShoppingStats) => SummaryCardItem[]
}
