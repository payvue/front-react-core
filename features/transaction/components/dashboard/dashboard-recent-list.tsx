'use client'

import { TransactionModel } from '../../types'
import { TransactionListProps } from '../transaction-container'
import { Badge } from '@/components/ui/badge'
import { getCategoryLabel, getKindMeta, getStatusDisplay } from '../../utils/presentation'

export function DashboardRecentTransactionsList(props: TransactionListProps<TransactionModel>) {
  const { items, isLoading } = props

  if (isLoading && items.length === 0) {
    return (
      <div className="space-y-3">
        <div className="h-16 w-full animate-pulse rounded-lg bg-muted" />
        <div className="h-16 w-full animate-pulse rounded-lg bg-muted" />
      </div>
    )
  }

  if (!items.length) {
    return <p className="text-sm text-muted-foreground">최근 거래 내역이 없습니다.</p>
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const kindMeta = getKindMeta(item.kind)
        return (
          <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-muted p-2">{kindMeta.icon}</div>
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{new Date(item.occurredAt).toLocaleDateString('ko-KR')}</span>
                  {item.category && (
                    <>
                      <Badge variant="outline" className="text-[10px]">
                        {getCategoryLabel(item.category)}
                      </Badge>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`text-sm font-medium ${item.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                {item.amount >= 0 ? '+' : '-'}
                {Math.abs(item.amount).toLocaleString()}원
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
        )
      })}
    </div>
  )
}
