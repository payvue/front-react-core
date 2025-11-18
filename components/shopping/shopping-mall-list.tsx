'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { StoreList } from '@/components/shopping/store-list'
import type { SmartStoreInfo } from '@/features/smartstore/types'

interface ShoppingMallListProps {
  stores: SmartStoreInfo[]
  onToggleSubscription: (storeId: string) => void
}

export function ShoppingMallList({ stores, onToggleSubscription }: ShoppingMallListProps) {
  const [search, setSearch] = useState('')

  const formatNumber = (num?: number) => {
    if (typeof num !== 'number') return '0'
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const themeOptions = useMemo(() => {
    const set = new Set<string>()
    stores.forEach((store) => store.themes?.forEach((theme) => set.add(theme)))
    return Array.from(set)
  }, [stores])

  const filteredStores = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return stores.filter((store) => {
      const matchesKeyword = keyword
        ? store.name.toLowerCase().includes(keyword) ||
          store.category.toLowerCase().includes(keyword) ||
          store.summary.toLowerCase().includes(keyword)
        : true

      return matchesKeyword
    })
  }, [stores, search])

  type SubscribedProduct = StoreProduct & { store: SmartStoreInfo }
  const subscribedProducts = useMemo<SubscribedProduct[]>(
    () => stores.flatMap((store) => store.products.map((product) => ({ ...product, store }))),
    [stores],
  )

  const emptyState = (
    <Card>
      <CardContent className="py-12 text-center space-y-2">
        <p className="font-medium">구독 중인 쇼핑몰이 없습니다</p>
        <p className="text-sm text-muted-foreground">
          위 검색 필터에서 구독할 스토어를 찾아보세요.
        </p>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div>
          <h2 className="text-xl font-semibold">구독 중인 쇼핑몰</h2>
          <p className="text-muted-foreground">이미 구독한 스토어만 필터링해 확인할 수 있습니다.</p>
        </div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <Input
              placeholder="쇼핑몰 이름/설명을 검색하세요"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          {search !== 'all' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch('')
              }}
            >
              필터 초기화
            </Button>
          )}
        </div>
      </div>

      <StoreList
        stores={filteredStores}
        emptyState={emptyState}
        onToggleSubscription={onToggleSubscription}
        formatNumber={formatNumber}
      />
    </div>
  )
}
