"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Heart, ShoppingCart, Star, Trash2, Plus, Minus } from "lucide-react"

interface CartItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  image: string
  mall: string
  category: string
  discount?: number
  quantity: number
}

interface WishlistItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  image: string
  mall: string
  category: string
  discount?: number
  isLiked: boolean
}

export function WishlistPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [activeTab, setActiveTab] = useState<"cart" | "wishlist">("cart")

  useEffect(() => {
    // Load cart items
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    setCartItems(cart)

    // Load wishlist items (liked products)
    const allProducts = JSON.parse(localStorage.getItem("allProducts") || "[]")
    const likedProducts = allProducts.filter((product: any) => product.isLiked)
    setWishlistItems(likedProducts)
  }, [])

  const getMallName = (mallId: string) => {
    const mallNames: Record<string, string> = {
      coupang: "쿠팡",
      gmarket: "G마켓",
      "11st": "11번가",
      auction: "옥션",
      oliveyoung: "올리브영",
      musinsa: "무신사",
    }
    return mallNames[mallId] || mallId
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR").format(amount)
  }

  const updateCartQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId)
      return
    }

    const updatedCart = cartItems.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
    setCartItems(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
  }

  const removeFromCart = (itemId: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId)
    setCartItems(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
  }

  const removeFromWishlist = (itemId: string) => {
    const updatedWishlist = wishlistItems.filter((item) => item.id !== itemId)
    setWishlistItems(updatedWishlist)

    // Update the main products list
    const allProducts = JSON.parse(localStorage.getItem("allProducts") || "[]")
    const updatedProducts = allProducts.map((product: any) =>
      product.id === itemId ? { ...product, isLiked: false } : product,
    )
    localStorage.setItem("allProducts", JSON.stringify(updatedProducts))
  }

  const addToCartFromWishlist = (item: WishlistItem) => {
    const cartItem: CartItem = { ...item, quantity: 1 }
    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id)

    if (existingItem) {
      updateCartQuantity(item.id, existingItem.quantity + 1)
    } else {
      const updatedCart = [...cartItems, cartItem]
      setCartItems(updatedCart)
      localStorage.setItem("cart", JSON.stringify(updatedCart))
    }

    alert(`${item.name}이(가) 장바구니에 추가되었습니다!`)
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("장바구니가 비어있습니다.")
      return
    }

    // Store cart items for checkout
    localStorage.setItem("checkoutItems", JSON.stringify(cartItems))
    window.location.href = "/product-payment"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">관심 상품 관리</h2>
        <div className="flex gap-2">
          <Button
            variant={activeTab === "cart" ? "default" : "outline"}
            onClick={() => setActiveTab("cart")}
            className="flex items-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            장바구니 ({getTotalItems()})
          </Button>
          <Button
            variant={activeTab === "wishlist" ? "default" : "outline"}
            onClick={() => setActiveTab("wishlist")}
            className="flex items-center gap-2"
          >
            <Heart className="h-4 w-4" />
            찜한 상품 ({wishlistItems.length})
          </Button>
        </div>
      </div>

      {activeTab === "cart" && (
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
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {getMallName(item.mall)}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              <span className="text-xs text-muted-foreground">
                                {item.rating} ({item.reviewCount})
                              </span>
                            </div>
                          </div>
                          <h3 className="font-medium mb-2">{item.name}</h3>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-lg font-bold text-primary">{formatCurrency(item.price)}원</span>
                            {item.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                {formatCurrency(item.originalPrice)}원
                              </span>
                            )}
                            {item.discount && <Badge className="bg-red-500 text-xs">{item.discount}% OFF</Badge>}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 bg-transparent"
                                onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 bg-transparent"
                                onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-700"
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
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>총 상품 수량</span>
                      <span>{getTotalItems()}개</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium">총 결제 금액</span>
                      <span className="text-2xl font-bold text-primary">{formatCurrency(getTotalPrice())}원</span>
                    </div>
                    <Button onClick={handleCheckout} className="w-full h-12" size="lg">
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      {formatCurrency(getTotalPrice())}원 결제하기
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}

      {activeTab === "wishlist" && (
        <div className="space-y-4">
          {wishlistItems.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">찜한 상품이 없습니다</h3>
                <p className="text-muted-foreground">마음에 드는 상품을 찜해보세요</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {wishlistItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="relative mb-3">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Badge variant="secondary" className="absolute top-2 left-2 text-xs bg-white/90 text-gray-800">
                        {getMallName(item.mall)}
                      </Badge>
                      {item.discount && (
                        <Badge className="absolute bottom-2 right-2 bg-red-500 text-xs">{item.discount}% OFF</Badge>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs text-muted-foreground">
                          {item.rating} ({item.reviewCount})
                        </span>
                      </div>
                      <h3 className="font-medium text-sm line-clamp-2">{item.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-primary">{formatCurrency(item.price)}원</span>
                        {item.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatCurrency(item.originalPrice)}원
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => addToCartFromWishlist(item)}
                        >
                          <ShoppingCart className="mr-1 h-3 w-3" />
                          담기
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromWishlist(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Heart className="h-4 w-4 fill-current" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
