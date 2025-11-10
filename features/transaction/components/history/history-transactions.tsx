'use client'

import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { TransactionModel } from '../../types'
import { TransactionListProps } from '../transaction-container'
import { getCategoryIcon, getStatusDisplay } from '../../utils/presentation'

export function HistoryTransactions(props: TransactionListProps<TransactionModel>) {
  const { items, isLoading, onSelect, selectedId, infinite, pagination } = props
  const { ref, inView } = useInView({ threshold: 0 })
  const totalCount = pagination?.totalItems ?? items.length

  useEffect(() => {
    if (infinite && inView && infinite.hasMore && !infinite.isFetchingMore) {
      infinite.onLoadMore()
    }
  }, [infinite, inView])

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>거래 히스토리</CardTitle>
          <div className="text-sm text-muted-foreground">
            {totalCount.toLocaleString()}건 조회됨
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading && items.length === 0 && (
          <div className="space-y-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        )}
        {!isLoading && items.length === 0 && (
          <p className="text-sm text-muted-foreground">표시할 거래 내역이 없습니다.</p>
        )}
        {items.map((item) => {
          const isActive = selectedId === item.id
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className={`w-full rounded-lg border px-4 py-3 text-left transition hover:border-primary ${
                isActive ? 'border-primary bg-primary/5' : 'border-border'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-muted p-2">{getCategoryIcon(item.category)}</div>
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.subtitle ?? '설명 없음'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-semibold ${item.amount < 0 ? 'text-red-600' : 'text-green-600'}`}
                  >
                    {item.amount.toLocaleString()}원
                  </p>
                  {(() => {
                    const statusDisplay = getStatusDisplay(item.status)
                    return (
                      <Badge variant="secondary" className={statusDisplay.className}>
                        {statusDisplay.label}
                      </Badge>
                    )
                  })()}
                </div>
              </div>
            </button>
          )
        })}
        {pagination && (
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              className="rounded border px-3 py-1 text-xs disabled:opacity-50"
              disabled={pagination.page === 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
            >
              이전
            </button>
            <span className="text-xs text-muted-foreground">
              {pagination.page} /{' '}
              {Math.max(1, Math.ceil(pagination.totalItems / pagination.pageSize))}
            </span>
            <button
              type="button"
              className="rounded border px-3 py-1 text-xs disabled:opacity-50"
              disabled={pagination.page >= Math.ceil(pagination.totalItems / pagination.pageSize)}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
            >
              다음
            </button>
          </div>
        )}
        {infinite && (
          <div ref={ref} className="h-8 w-full">
            {infinite.isFetchingMore && (
              <div className="flex items-center justify-center py-2 text-xs text-muted-foreground">
                더 많은 데이터를 불러오는 중입니다...
              </div>
            )}
            {!infinite.hasMore && items.length > 0 && !infinite.isFetchingMore && (
              <div className="pt-2 text-center text-xs text-muted-foreground">
                모든 거래 내역을 불러왔습니다.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
