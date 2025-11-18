'use client'

import type { SubscribedProduct } from '@/features/product/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/util/display'
import { Star } from 'lucide-react'

interface ProductGridProps {
  products: SubscribedProduct[]
  onAddToCart: (product: SubscribedProduct) => void
}

export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  if (!products.length) {
    return (
      <Card>
        <CardContent className="py-12 text-center space-y-2">
          <p className="font-semibold">구독한 쇼핑몰의 상품이 없습니다</p>
          <p className="text-sm text-muted-foreground">쇼핑몰 탭에서 구독을 활성화해보세요.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <Card key={`${product.mall}-${product.id}`} className="flex flex-col">
          <CardContent className="p-4 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img
                src={product.image || '/placeholder.svg'}
                alt={product.name}
                className="h-16 w-16 rounded-lg object-cover"
              />
              <div>
                <h3 className="text-base font-semibold">{product.name}</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary">{product.mallName}</Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500" />
                    {product.rating}
                  </div>
                  <span>
                    {typeof product.reviewCount === 'number'
                      ? `${product.reviewCount.toLocaleString()} 리뷰`
                      : '리뷰 정보 없음'}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-primary">
                  {formatCurrency(product.price)}원
                </p>
                {product.originalPrice && (
                  <p className="text-xs text-muted-foreground line-through">
                    {formatCurrency(product.originalPrice)}원
                  </p>
                )}
              </div>
              <Button size="sm" onClick={() => onAddToCart(product)}>
                장바구니
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
