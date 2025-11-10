'use client'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TransactionFiltersRenderProps } from '../transaction-container'
import { AssetFiltersState } from '../../config/asset-filters'
import { Download } from 'lucide-react'

export function AssetFilters(props: TransactionFiltersRenderProps<AssetFiltersState>) {
  const { filters, onFiltersChange } = props

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="text-lg font-semibold">자산 거래 내역</div>
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={filters.kind}
          onValueChange={(value) => onFiltersChange({ kind: value as AssetFiltersState['kind'] })}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="거래 유형" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="asset_purchase">구매</SelectItem>
            <SelectItem value="asset_use">사용</SelectItem>
            <SelectItem value="share">공유</SelectItem>
            <SelectItem value="receive">받음</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.status}
          onValueChange={(value) =>
            onFiltersChange({ status: value as AssetFiltersState['status'] })
          }
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="상태" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="completed">완료</SelectItem>
            <SelectItem value="pending">대기</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          내보내기
        </Button>
      </div>
    </div>
  )
}
