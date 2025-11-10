'use client'

import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TransactionFiltersRenderProps } from '../transaction-container'
import { HistoryFiltersState } from '../../config/history-filters'

export function HistoryFilters(props: TransactionFiltersRenderProps<HistoryFiltersState>) {
  const { filters, onFiltersChange } = props

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row">
        <div className="flex flex-1 flex-col gap-2">
          <span className="text-xs text-muted-foreground">거래 유형</span>
          <Select
            value={filters.kind}
            onValueChange={(value) =>
              onFiltersChange({ kind: value as HistoryFiltersState['kind'] })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="전체" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="payment">결제</SelectItem>
              <SelectItem value="charge">충전</SelectItem>
              <SelectItem value="transfer">이체</SelectItem>
              <SelectItem value="asset_purchase">자산 구매</SelectItem>
              <SelectItem value="asset_use">자산 사용</SelectItem>
              <SelectItem value="share">공유</SelectItem>
              <SelectItem value="receive">수신</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <span className="text-xs text-muted-foreground">거래 상태</span>
          <Select
            value={filters.status}
            onValueChange={(value) =>
              onFiltersChange({ status: value as HistoryFiltersState['status'] })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="전체" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="completed">완료</SelectItem>
              <SelectItem value="pending">대기</SelectItem>
              <SelectItem value="failed">실패</SelectItem>
              <SelectItem value="refunded">환불</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
