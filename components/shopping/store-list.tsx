'use client'

import type { FC, ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Package, Star, TrendingUp, Users } from 'lucide-react'
import type { StoreEntity } from '@/features/shopping/store/mock-store'

interface StoreListProps {
  stores: StoreEntity[]
  emptyState?: ReactNode
  onToggleSubscription: (storeId: string) => void
  formatNumber?: (value: number) => string
  className?: string
}

interface StoreCardProps {
  store: StoreEntity
  onToggleSubscription: (id: string) => void
  formatNumber: (value: number) => string
}

export const StoreCard: FC<StoreCardProps> = ({ store, onToggleSubscription, formatNumber }) => {
  const ringClass = store.isSubscribed ? 'ring-2 ring-primary' : ''

  return (
    <Card key={store.id} className={`transition-all ${ringClass}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{store.logo}</div>
            <div>
              <CardTitle className="text-lg">{store.name}</CardTitle>
              <div className="flex flex-wrap gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {store.category}
                </Badge>
                {(store.themes ?? []).map((theme) => (
                  <Badge key={`${store.id}-${theme}`} variant="outline" className="text-[10px]">
                    {theme}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Switch
              checked={store.isSubscribed}
              onCheckedChange={() => onToggleSubscription(store.id)}
            />
            {store.isSubscribed && (
              <Badge variant="default" className="text-xs bg-primary">
                구독중
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {store.summary && <p className="text-sm text-muted-foreground mb-4">{store.summary}</p>}

        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="h-3 w-3 text-yellow-500" />
              <span className="text-sm font-medium">{store.rating}</span>
            </div>
            <p className="text-xs text-muted-foreground">평점</p>
          </div>

          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="h-3 w-3 text-blue-500" />
              <span className="text-sm font-medium">{formatNumber(store.subscribers)}</span>
            </div>
            <p className="text-xs text-muted-foreground">구독자</p>
          </div>

          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-sm font-medium">{formatNumber(store.monthlyDeals)}</span>
            </div>
            <p className="text-xs text-muted-foreground">월 거래</p>
          </div>

          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <Package className="h-3 w-3 text-purple-500" />
              <span className="text-sm font-medium">{store.products.length}</span>
            </div>
            <p className="text-xs text-muted-foreground">상품 수</p>
          </div>
        </div>

        {store.products.length > 0 && (
          <>
            <Separator className="my-4" />
            <p className="text-xs text-muted-foreground mb-2">대표 상품</p>
            <div className="flex flex-wrap gap-2">
              {store.products.slice(0, 3).map((product) => (
                <Badge key={product.id} variant="outline" className="text-xs">
                  {product.name}
                </Badge>
              ))}
              {store.products.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{store.products.length - 3}
                </Badge>
              )}
            </div>
          </>
        )}

        {store.isSubscribed && (
          <div className="mt-4 p-3 bg-primary/10 rounded-lg">
            <p className="text-xs text-primary font-medium">
              구독 중 - 상품 정보를 동기화하고 있습니다
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export const StoreList: FC<StoreListProps> = ({
  stores,
  emptyState,
  onToggleSubscription,
  formatNumber = (value) => value.toLocaleString(),
  className,
}) => {
  if (!stores.length) {
    return <>{emptyState}</>
  }

  return (
    <div className={`grid gap-4 ${className ?? ''}`}>
      {stores.map((store) => (
        <StoreCard
          key={store.id}
          store={store}
          onToggleSubscription={onToggleSubscription}
          formatNumber={formatNumber}
        />
      ))}
    </div>
  )
}
