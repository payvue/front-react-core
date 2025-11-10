'use client'

import { TransactionModel } from '../../types'
import { TransactionListProps } from '../transaction-container'
import { Badge } from '@/components/ui/badge'
import { getKindMeta, getStatusDisplay } from '../../utils/presentation'

export function AssetTransactionsList(props: TransactionListProps<TransactionModel>) {
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
    return <p className="text-sm text-muted-foreground">자산 거래 내역이 없습니다.</p>
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const typeMeta = getKindMeta(item.kind)
        return (
          <div key={item.id} className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-muted p-2">{typeMeta?.icon}</div>
              <div>
                <p className="font-medium">{item.title}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-[10px]">
                    {typeMeta.label}
                  </Badge>
                  <span>{new Date(item.occurredAt).toLocaleDateString('ko-KR')}</span>
                  {item.category && (
                    <>
                      <span>•</span>
                      <span>{item.category}</span>
                    </>
                  )}
                  {item.metadata?.그룹 && item.metadata.그룹 !== '-' && (
                    <>
                      <span>•</span>
                      <span>{item.metadata.그룹}</span>
                    </>
                  )}
                  {item.metadata?.관련유저 && item.metadata.관련유저 !== '-' && (
                    <>
                      <span>•</span>
                      <span>{item.metadata.관련유저}</span>
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
