'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Trash2 } from 'lucide-react'
import type { StoreInventoryProduct } from '@/features/product/types'
import type { SmartStoreMember } from '@/features/smartstore/types'
import { formatCurrency } from '@/util/display'

interface StoreInventoryCardProps {
  product: StoreInventoryProduct
  author?: SmartStoreMember
  onDelete: () => void
}

export function StoreInventoryCard({ product, author, onDelete }: StoreInventoryCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <img
            src={product.image || '/placeholder.svg'}
            alt={product.name}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div>
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{product.category}</Badge>
              <span className="text-xs text-muted-foreground">재고 {product.quantity}개</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            수정
          </Button>
          <Button variant="ghost" size="sm" className="text-destructive" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
            삭제
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">가격</p>
            <p className="text-lg font-semibold">{formatCurrency(product.price)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">재고</p>
            <p className="text-lg font-semibold">{product.quantity}개</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border p-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={author?.avatar} alt={author?.name} />
            <AvatarFallback>{author?.name?.slice(0, 2) ?? 'GM'}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{author?.name ?? '미지정'}</p>
            <p className="text-xs text-muted-foreground">{author?.role ?? '권한 필요'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
