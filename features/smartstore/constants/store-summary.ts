import type { SmartStoreOverviewStats } from '@/features/smartstore/types'

export interface StoreSummaryDefinition {
  key: string
  title: string
  valueDescription: string
  statKey?: keyof SmartStoreOverviewStats
  format?: (stats: SmartStoreOverviewStats) => string | number
}

export const STORE_SUMMARY_DEFS: StoreSummaryDefinition[] = [
  {
    key: 'store-count',
    title: '운영 중인 스토어',
    valueDescription: '등록 완료',
    statKey: 'storeCount',
  },
  {
    key: 'product-count',
    title: '상품 수량',
    valueDescription: '전체 상품',
    statKey: 'productCount',
  },
  {
    key: 'subscriber-count',
    title: '누적 구독자',
    valueDescription: '모든 스토어 기준',
    format: (stats) => stats.subscriberCount.toLocaleString(),
  },
  {
    key: 'avg-rating',
    title: '평균 만족도',
    valueDescription: '5점 만점',
    statKey: 'averageRating',
  },
]
