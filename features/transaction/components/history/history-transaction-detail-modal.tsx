'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  TransactionDetailModalProps,
  TransactionModel,
} from '../../components/transaction-container'

export function HistoryTransactionDetailModal(
  props: TransactionDetailModalProps<TransactionModel>,
) {
  const { item, isLoading, open, onClose } = props

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{item?.title ?? '거래 상세'}</DialogTitle>
          <DialogDescription>
            거래 세부 정보를 확인하고 이상 거래 여부를 검토할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-2">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : item ? (
            <div className="space-y-4 text-sm">
              <section className="space-y-1">
                <p className="text-xs text-muted-foreground">거래 ID</p>
                <p className="font-medium">{item.id}</p>
              </section>
              <section className="space-y-1">
                <p className="text-xs text-muted-foreground">거래 금액</p>
                <p
                  className={`text-base font-semibold ${item.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {item.amount.toLocaleString()}원
                </p>
              </section>
              <section className="space-y-1">
                <p className="text-xs text-muted-foreground">상태</p>
                <Badge variant="secondary">{item.status}</Badge>
              </section>
              <section className="space-y-1">
                <p className="text-xs text-muted-foreground">발생 일시</p>
                <p>{new Date(item.occurredAt).toLocaleString('ko-KR')}</p>
              </section>
              {item.metadata && (
                <section className="space-y-2">
                  <p className="text-xs text-muted-foreground">추가 정보</p>
                  <div className="space-y-1 rounded-md border p-3">
                    {Object.entries(item.metadata).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{key}</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">선택된 거래가 없습니다.</p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
