'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TransactionFilters, TransactionFilterState } from './transaction-filters'
import { useTransactionAnalyticsFilters } from './useTransactionAnalyticsFilters'
import {
  TransactionContainer,
  historyBuilder,
  HistoryTransactions,
  HistoryTransactionDetailModal,
  useInfiniteTransactionHistoryQuery,
  getCategoryLabel,
} from '@/features/transaction'
import type { HistoryTransactionSchema, TransactionKind } from '@/features/transaction'
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  ShoppingCart,
  Calendar,
  PieChart,
  BarChart3,
} from 'lucide-react'
import { buildTransactionStats } from '@/shared/utils/statistics'
import { mapHistoryToStatsInput } from '@/features/transaction/model/history-analytics'

const TYPE_LABEL_MAP: Record<TransactionKind, string> = {
  payment: '일반 결제',
  charge: '충전',
  transfer: '송금',
  asset_purchase: '자산 구매',
  asset_use: '자산 사용',
  share: '공유',
  receive: '수신',
}

export function TransactionAnalytics() {
  const historyQuery = useInfiniteTransactionHistoryQuery({ pageSize: 15 })
  const { filters, setFilters, resetFilters } = useTransactionAnalyticsFilters()

  const filteredInfiniteData = useMemo(() => {
    if (!historyQuery.data) return undefined

    const pages = historyQuery.data.pages.map((page) =>
      page.filter((transaction) => matchTransaction(transaction, filters)),
    )

    return {
      ...historyQuery.data,
      pages,
    }
  }, [historyQuery.data, filters])

  const filteredTransactions = useMemo(() => {
    return filteredInfiniteData?.pages.flat() ?? []
  }, [filteredInfiniteData])

  const analytics = useMemo(() => {
    const statsInput = mapHistoryToStatsInput(filteredTransactions)
    return buildTransactionStats(statsInput)
  }, [filteredTransactions])

  const filteredQueryResult = useMemo(() => {
    return {
      ...historyQuery,
      data: filteredInfiniteData,
    }
  }, [historyQuery, filteredInfiniteData])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(amount)
  }

  const getTransactionIcon = (type: TransactionKind) => {
    switch (type) {
      case 'payment':
      case 'asset_purchase':
      case 'asset_use':
        return <ShoppingCart className="h-4 w-4" />
      case 'charge':
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />
      case 'transfer':
        return <ArrowUpRight className="h-4 w-4 text-blue-600" />
      case 'share':
        return <ArrowUpRight className="h-4 w-4 text-purple-600" />
      case 'receive':
        return <ArrowDownLeft className="h-4 w-4 text-purple-600" />
      default:
        return <ShoppingCart className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <TransactionFilters filters={filters} onFiltersChange={setFilters} onReset={resetFilters} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">총 수입</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(analytics.totalIncome)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">총 지출</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(analytics.totalExpense)}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">순 금액</p>
                <p
                  className={`text-2xl font-bold ${analytics.netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {formatCurrency(analytics.netAmount)}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">거래 건수</p>
                <p className="text-2xl font-bold">{analytics.transactionCount}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              카테고리별 분석
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(analytics.categoryStats)
                .sort(([, a], [, b]) => b.amount - a.amount)
                .map(([category, stats]) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{getCategoryLabel(category)}</Badge>
                      <span className="text-sm text-muted-foreground">{stats.count}건</span>
                    </div>
                    <span className="font-medium">{formatCurrency(stats.amount)}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              거래 유형별 분석
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(analytics.typeStats)
                .sort(([, a], [, b]) => b.amount - a.amount)
                .map(([type, stats]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTransactionIcon(type as TransactionKind)}
                      <span className="text-sm">
                        {TYPE_LABEL_MAP[type as TransactionKind] ?? type}
                      </span>
                      <span className="text-sm text-muted-foreground">{stats.count}건</span>
                    </div>
                    <span className="font-medium">{formatCurrency(stats.amount)}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">거래 내역</h3>
            <p className="text-sm text-muted-foreground">
              총 {analytics.transactionCount.toLocaleString()}건 • 스크롤 시 자동으로 추가 내역을
              불러옵니다
            </p>
          </div>
          {historyQuery.isFetching && (
            <span className="text-xs text-muted-foreground">데이터 동기화 중...</span>
          )}
        </div>
        <TransactionContainer
          queryResult={filteredQueryResult}
          modelBuilder={historyBuilder}
          listComponent={HistoryTransactions}
          renderDetail={(detailProps) => <HistoryTransactionDetailModal {...detailProps} />}
          mode="infinite"
        />
      </section>
    </div>
  )
}

const matchTransaction = (
  transaction: HistoryTransactionSchema,
  filters: TransactionFilterState,
) => {
  const occurredDate = transaction.details?.date ?? transaction.occurredAt?.slice(0, 10) ?? ''

  if (filters.dateRange.start && occurredDate < filters.dateRange.start) return false
  if (filters.dateRange.end && occurredDate > filters.dateRange.end) return false
  if (filters.transactionType !== 'all' && transaction.kind !== filters.transactionType)
    return false
  if (filters.category !== 'all' && transaction.category !== filters.category) return false
  if (filters.status !== 'all' && transaction.status !== filters.status) return false

  const absAmount = Math.abs(transaction.amount)
  if (filters.amountRange.min && absAmount < Number(filters.amountRange.min)) return false
  if (filters.amountRange.max && absAmount > Number(filters.amountRange.max)) return false

  return true
}
