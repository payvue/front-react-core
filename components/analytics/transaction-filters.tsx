'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Filter, X } from 'lucide-react'

export interface TransactionFilterState {
  dateRange: {
    start: string
    end: string
  }
  transactionType: string
  category: string
  status: string
  amountRange: {
    min: string
    max: string
  }
}

interface TransactionFiltersProps {
  filters: TransactionFilterState
  onFiltersChange: (filters: TransactionFilterState) => void
  onReset: () => void
}

export function TransactionFilters({ filters, onFiltersChange, onReset }: TransactionFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const updateFilter = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  const updateNestedFilter = (parentKey: string, childKey: string, value: string) => {
    onFiltersChange({
      ...filters,
      [parentKey]: {
        ...filters[parentKey as keyof TransactionFilterState],
        [childKey]: value,
      },
    })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.dateRange.start || filters.dateRange.end) count++
    if (filters.transactionType && filters.transactionType !== 'all') count++
    if (filters.category && filters.category !== 'all') count++
    if (filters.status && filters.status !== 'all') count++
    if (filters.amountRange.min || filters.amountRange.max) count++
    return count
  }

  const activeFiltersCount = getActiveFiltersCount()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <CardTitle>필터</CardTitle>
            {activeFiltersCount > 0 && <Badge variant="secondary">{activeFiltersCount}</Badge>}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? '접기' : '펼치기'}
            </Button>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={onReset}>
                <X className="h-4 w-4" />
                초기화
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">시작일</Label>
              <Input
                id="start-date"
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => updateNestedFilter('dateRange', 'start', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">종료일</Label>
              <Input
                id="end-date"
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => updateNestedFilter('dateRange', 'end', e.target.value)}
              />
            </div>
          </div>

          {/* Transaction Type */}
          <div className="space-y-2">
            <Label>거래 유형</Label>
            <Select
              value={filters.transactionType}
              onValueChange={(value) => updateFilter('transactionType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="거래 유형 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="payment">일반 결제</SelectItem>
                <SelectItem value="charge">충전</SelectItem>
                <SelectItem value="transfer">송금</SelectItem>
                <SelectItem value="asset_purchase">자산 구매</SelectItem>
                <SelectItem value="asset_use">자산 사용</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>카테고리</Label>
            <Select
              value={filters.category}
              onValueChange={(value) => updateFilter('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="온라인 자산">온라인 자산</SelectItem>
                <SelectItem value="쇼핑">쇼핑</SelectItem>
                <SelectItem value="식음료">식음료</SelectItem>
                <SelectItem value="교통">교통</SelectItem>
                <SelectItem value="엔터테인먼트">엔터테인먼트</SelectItem>
                <SelectItem value="기타">기타</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>상태</Label>
            <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="상태 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="completed">완료</SelectItem>
                <SelectItem value="pending">대기</SelectItem>
                <SelectItem value="failed">실패</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Amount Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min-amount">최소 금액</Label>
              <Input
                id="min-amount"
                type="number"
                placeholder="0"
                value={filters.amountRange.min}
                onChange={(e) => updateNestedFilter('amountRange', 'min', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-amount">최대 금액</Label>
              <Input
                id="max-amount"
                type="number"
                placeholder="1000000"
                value={filters.amountRange.max}
                onChange={(e) => updateNestedFilter('amountRange', 'max', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
