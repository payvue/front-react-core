'use client'

import { TransactionModel } from '../../types'
import { TransactionListProps } from '../transaction-container'
import { Badge } from '@/components/ui/badge'
import { getStatusDisplay, getGroupCategoryIcon } from '../../utils/presentation'

export function GroupTransactionsList(props: TransactionListProps<TransactionModel>) {
  const { items, isLoading } = props

  if (isLoading && items.length === 0) {
    return (
      <div className="space-y-2">
        <div className="h-16 w-full animate-pulse rounded-lg bg-muted" />
        <div className="h-16 w-full animate-pulse rounded-lg bg-muted" />
      </div>
    )
  }

  if (!items.length) {
    return <p className="text-sm text-muted-foreground">거래 내역이 없습니다.</p>
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const statusDisplay = getStatusDisplay(item.status)
        return (
          <div key={item.id} className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-muted p-2">{getGroupCategoryIcon(item.category)}</div>
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.subtitle}</p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`text-sm font-semibold ${item.amount < 0 ? 'text-red-600' : 'text-green-600'}`}
              >
                {item.amount.toLocaleString()}원
              </p>
              <Badge variant="secondary" className={statusDisplay.className}>
                {statusDisplay.label}
              </Badge>
            </div>
          </div>
        )
      })}
    </div>
  )
}
