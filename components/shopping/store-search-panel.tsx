'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ListFilter, Flame } from 'lucide-react'
import { StoreCard, StoreList } from '@/components/shopping/store-list'
import type { SmartStoreInfo } from '@/features/smartstore/types'

interface StoreSearchPanelProps {
  stores: SmartStoreInfo[]
  onToggleSubscription: (storeId: string) => void
}

const FILTER_OPTIONS = [
  { value: 'summary', label: '커뮤니티 정보' },
  { value: 'product', label: '대표 상품' },
  { value: 'theme', label: '상품 테마' },
] as const

type FilterMode = (typeof FILTER_OPTIONS)[number]['value']

export function StoreSearchPanel({ stores, onToggleSubscription }: StoreSearchPanelProps) {
  const [keyword, setKeyword] = useState('')
  const [filterMode, setFilterMode] = useState<FilterMode>('summary')

  const normalizedKeyword = keyword.trim().toLowerCase()
  const hasActiveFilter = Boolean(normalizedKeyword)

  const filteredStores = useMemo(() => {
    if (!hasActiveFilter) return []

    return stores.filter((store) => {
      if (!normalizedKeyword) return false

      if (filterMode === 'product') {
        return store.products.some((product) =>
          product.name.toLowerCase().includes(normalizedKeyword),
        )
      }

      if (filterMode === 'theme') {
        return (
          store.themes?.some((theme) => theme.toLowerCase().includes(normalizedKeyword)) ||
          store.category.toLowerCase().includes(normalizedKeyword)
        )
      }

      return (
        store.name.toLowerCase().includes(normalizedKeyword) ||
        store.summary?.toLowerCase().includes(normalizedKeyword) ||
        store.description.toLowerCase().includes(normalizedKeyword)
      )
    })
  }, [stores, normalizedKeyword, filterMode, hasActiveFilter])

  const popularStores = useMemo(() => {
    return [...stores].sort((a, b) => b.monthlyVolume - a.monthlyVolume).slice(0, 3)
  }, [stores])

  const shouldShowPopular = filteredStores.length === 0 && popularStores.length > 0

  const emptyState = (
    <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
      조건에 맞는 쇼핑몰이 없습니다.
    </div>
  )

  const formatNumber = (value?: number) => {
    if (typeof value !== 'number') return '0'
    return value.toLocaleString()
  }

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <Input
            placeholder="검색 키워드를 입력하세요"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
          <div className="flex items-center gap-2">
            <ListFilter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterMode} onValueChange={(value: FilterMode) => setFilterMode(value)}>
              <SelectTrigger className="md:w-56">
                <SelectValue placeholder="검색 기준" />
              </SelectTrigger>
              <SelectContent>
                {FILTER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {hasActiveFilter && (
          <Button variant="ghost" size="sm" className="self-start" onClick={() => setKeyword('')}>
            검색 초기화
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {shouldShowPopular && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold">인기 쇼핑몰 하이라이트</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {popularStores.map((store) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  onToggleSubscription={onToggleSubscription}
                  formatNumber={formatNumber}
                />
              ))}
            </div>
          </div>
        )}

        <StoreList
          stores={filteredStores}
          emptyState={!hasActiveFilter ? null : emptyState}
          onToggleSubscription={onToggleSubscription}
          formatNumber={formatNumber}
          className="grid-cols-1"
        />
      </CardContent>
    </Card>
  )
}
