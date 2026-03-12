import { ShoppingBag, Star, Store } from 'lucide-react'
import type { ShoppingSummaryService, ShoppingStats } from '@/features/shopping/types'
import type { SummaryCardItem } from '@/shared/components/summary-card-header'

class DefaultShoppingSummaryService implements ShoppingSummaryService {
  getSummaryItems(stats: ShoppingStats): SummaryCardItem[] {
    return [
      {
        key: 'subscribed-stores',
        title: '구독 쇼핑몰',
        icon: <Store className="h-4 w-4 text-muted-foreground" />,
        value: stats.subscribedStores,
        valueDescription: '활성 구독',
      },
      {
        key: 'monthly-shopping',
        title: '이번 달 쇼핑',
        icon: <ShoppingBag className="h-4 w-4 text-muted-foreground" />,
        value: '₩0',
        valueDescription: '0건 구매',
      },
      {
        key: 'points',
        title: '적립 포인트',
        icon: <Star className="h-4 w-4 text-muted-foreground" />,
        value: '0P',
        valueDescription: '이번 달 적립',
        valueClassName: 'text-yellow-600',
      },
    ]
  }
}

export const defaultShoppingSummaryService = new DefaultShoppingSummaryService()

export { DefaultShoppingSummaryService }
