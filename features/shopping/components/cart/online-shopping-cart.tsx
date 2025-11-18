'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, ShoppingCart, Star, Trash2, Plus, Minus } from 'lucide-react'
import { useCart } from '@/features/cart/hooks'
import { useRouter } from 'next/navigation'

export function OnlineShoppingCart() {
  const { items: cartItems, total, count, updateQuantity, removeItem } = useCart()
  const [activeTab, setActiveTab] = useState<'cart' | 'wishlist'>('cart')
  const router = useRouter()

  const formatCurrency = (amount: number) => new Intl.NumberFormat('ko-KR').format(amount)

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId)
      return
    }
    updateQuantity(itemId, newQuantity)
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('장바구니가 비어있습니다.')
      return
    }
    router.push('/product-payment')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">장바구니</h2>
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'cart' ? 'default' : 'outline'}
            onClick={() => setActiveTab('cart')}
            className="flex items-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            장바구니 ({count})
          </Button>
          <Button
            variant={activeTab === 'wishlist' ? 'default' : 'outline'}
            onClick={() => setActiveTab('wishlist')}
            className="flex items-center gap-2"
          >
            <Heart className="h-4 w-4" />
            찜한 상품 (0)
          </Button>
        </div>
      </div>

      {activeTab === 'cart' && (
        <div className="space-y-6">
          {cartItems.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">장바구니가 비어있습니다</h3>
                <p className="text-muted-foreground">상품을 장바구니에 담아보세요</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={item.image || '/placeholder.svg'}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {item.mallName ?? item.mall}
                            </Badge>
                            {item.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                <span className="text-xs text-muted-foreground">
                                  {item.rating} ({item.reviewCount})
                                </span>
                              </div>
                            )}
                          </div>
                          <h3 className="font-medium mb-2">{item.name}</h3>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-lg font-bold text-primary">
                              {formatCurrency(item.price)}원
                            </span>
                            {item.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                {formatCurrency(item.originalPrice)}원
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-medium">총 상품 수</p>
                    <p className="text-lg font-bold">{count}개</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-medium">총 금액</p>
                    <p className="text-2xl font-bold">{formatCurrency(total)}원</p>
                  </div>
                  <Button className="w-full" onClick={handleCheckout}>
                    결제하기
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}
    </div>
  )
}
