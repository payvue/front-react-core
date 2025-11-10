'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { TransactionModel } from '../../types'
import { TransactionDetailProps } from '../transaction-container'

export function HistoryTransactionsDetail(props: TransactionDetailProps<TransactionModel>) {
  const { item, isLoading } = props

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>거래 상세</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    )
  }

  if (!item) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>거래 상세</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          목록에서 거래를 선택하면 상세정보가 표시됩니다.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p className="text-muted-foreground">거래 ID: {item.id}</p>
        <p>금액: {item.amount.toLocaleString()}원</p>
        <p>상태: {item.status}</p>
        <p>발생일시: {new Date(item.occurredAt).toLocaleString('ko-KR')}</p>
        {item.metadata && (
          <div className="space-y-1 pt-2">
            {Object.entries(item.metadata).map(([key, value]) => (
              <div key={key} className="flex justify-between text-xs">
                <span className="text-muted-foreground">{key}</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
