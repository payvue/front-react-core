'use client'

import type { StoreInventoryProduct } from '@/features/product/types'
import type { SmartStoreMember } from '@/features/smartstore/types'
import { StoreInventoryCard } from './store-inventory-card'
import { Card, CardContent } from '@/components/ui/card'
import { ShoppingBag } from 'lucide-react'

interface StoreInventoryGridProps {
  products: StoreInventoryProduct[]
  communityMembers: SmartStoreMember[]
  onDelete: (productId: string) => void
}

export function StoreInventoryGrid({ products, communityMembers, onDelete }: StoreInventoryGridProps) {
  const getAuthor = (authorId: string) => communityMembers.find((member) => member.id === authorId)

  if (!products.length) {
    return (
      <Card>
        <CardContent className="py-12 text-center space-y-4">
          <div className="flex justify-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <p className="text-lg font-semibold">등록된 상품이 없습니다</p>
          <p className="text-sm text-muted-foreground">
            커뮤니티 구성원과 협력해 첫 상품을 등록해보세요
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      {products.map((product) => (
        <StoreInventoryCard
          key={product.id}
          product={product}
          author={getAuthor(product.authorId)}
          onDelete={() => onDelete(product.id)}
        />
      ))}
    </div>
  )
}
