"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductModal } from "./product-modal"
import { ShoppingCart, Star, Heart, Search, Filter, Plus } from "lucide-react"

interface Product {
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

const mockProducts: Product[] = [
  {
    id: "1",
    name: "무선 블루투스 이어폰",
    price: 89000,
    originalPrice: 129000,
    rating: 4.5,
    reviewCount: 1250,
    image: "/wireless-bluetooth-earphones.jpg",
    mall: "coupang",
    category: "전자기기",
    discount: 31,
    isLiked: false,
  },
  {
    id: "2",
    name: "프리미엄 운동화",
    price: 159000,
    originalPrice: 199000,
    rating: 4.3,
    reviewCount: 890,
    image: "/premium-sneakers.png",
    mall: "gmarket",
    category: "신발",
    discount: 20,
    isLiked: true,
  },
  {
    id: "3",
    name: "스킨케어 세트",
    price: 45000,
    rating: 4.7,
    reviewCount: 2100,
    image: "/skincare-set.png",
    mall: "oliveyoung",
    category: "뷰티",
    isLiked: false,
  },
  {
    id: "4",
    name: "캐주얼 맨투맨",
    price: 39000,
    originalPrice: 59000,
    rating: 4.2,
    reviewCount: 650,
    image: "/casual-sweatshirt.jpg",
    mall: "musinsa",
    category: "의류",
    discount: 34,
    isLiked: false,
  },
  {
    id: "5",
    name: "스마트 워치",
    price: 299000,
    originalPrice: 399000,
    rating: 4.4,
    reviewCount: 1800,
    image: "/modern-smartwatch.png",
    mall: "11st",
    category: "전자기기",
    discount: 25,
    isLiked: true,
  },
  {
    id: "6",
    name: "홈카페 원두",
    price: 25000,
    rating: 4.6,
    reviewCount: 950,
    image: "/pile-of-coffee-beans.png",
    mall: "coupang",
    category: "식품",
    isLiked: false,
  },
  {
    id: "7",
    name: "게이밍 키보드",
    price: 129000,
    originalPrice: 179000,
    rating: 4.8,
    reviewCount: 2300,
    image: "/gaming-keyboard.png",
    mall: "coupang",
    category: "전자기기",
    discount: 28,
    isLiked: false,
  },
  {
    id: "8",
    name: "여성 겨울 코트",
    price: 89000,
    originalPrice: 149000,
    rating: 4.1,
    reviewCount: 450,
    image: "/cozy-winter-coat.png",
    mall: "gmarket",
    category: "의류",
    discount: 40,
    isLiked: true,
  },
  {
    id: "9",
    name: "프리미엄 향수",
    price: 65000,
    rating: 4.5,
    reviewCount: 780,
    image: "/premium-perfume.jpg",
    mall: "oliveyoung",
    category: "뷰티",
    isLiked: false,
  },
  {
    id: "10",
    name: "홈트레이닝 세트",
    price: 199000,
    originalPrice: 299000,
    rating: 4.6,
    reviewCount: 1200,
    image: "/home-workout-setup.png",
    mall: "11st",
    category: "스포츠",
    discount: 33,
    isLiked: false,
  },
  {
    id: "11",
    name: "유기농 견과류",
    price: 18000,
    rating: 4.4,
    reviewCount: 650,
    image: "/organic-nuts.jpg",
    mall: "coupang",
    category: "식품",
    isLiked: true,
  },
  {
    id: "12",
    name: "블루투스 스피커",
    price: 79000,
    originalPrice: 119000,
    rating: 4.3,
    reviewCount: 890,
    image: "/bluetooth-speaker.png",
    mall: "gmarket",
    category: "전자기기",
    discount: 34,
    isLiked: false,
  },
  {
    id: "13",
    name: "아이패드 프로 케이스",
    price: 45000,
    originalPrice: 65000,
    rating: 4.7,
    reviewCount: 1450,
    image: "/ipad-pro-case.jpg",
    mall: "11st",
    category: "전자기기",
    discount: 31,
    isLiked: false,
  },
  {
    id: "14",
    name: "프리미엄 백팩",
    price: 129000,
    originalPrice: 179000,
    rating: 4.5,
    reviewCount: 720,
    image: "/premium-backpack.jpg",
    mall: "musinsa",
    category: "가방",
    discount: 28,
    isLiked: true,
  },
  {
    id: "15",
    name: "무선 충전기",
    price: 35000,
    rating: 4.2,
    reviewCount: 980,
    image: "/wireless-charger.png",
    mall: "coupang",
    category: "전자기기",
    discount: 26,
    isLiked: false,
  },
  {
    id: "16",
    name: "천연 샴푸",
    price: 28000,
    originalPrice: 38000,
    rating: 4.6,
    reviewCount: 1100,
    image: "/natural-shampoo.jpg",
    mall: "oliveyoung",
    category: "뷰티",
    discount: 26,
    isLiked: false,
  },
  {
    id: "17",
    name: "요가 매트",
    price: 55000,
    originalPrice: 75000,
    rating: 4.4,
    reviewCount: 650,
    image: "/rolled-yoga-mat.png",
    mall: "11st",
    category: "스포츠",
    discount: 27,
    isLiked: true,
  },
  {
    id: "18",
    name: "프리미엄 텀블러",
    price: 42000,
    rating: 4.3,
    reviewCount: 890,
    image: "/premium-tumbler.jpg",
    mall: "gmarket",
    category: "생활용품",
    discount: 28,
    isLiked: false,
  },
  {
    id: "19",
    name: "LED 데스크 램프",
    price: 68000,
    originalPrice: 95000,
    rating: 4.5,
    reviewCount: 1250,
    image: "/led-desk-lamp.png",
    mall: "coupang",
    category: "가전",
    discount: 28,
    isLiked: false,
  },
  {
    id: "20",
    name: "미니멀 지갑",
    price: 85000,
    originalPrice: 120000,
    rating: 4.7,
    reviewCount: 560,
    image: "/minimal-wallet.jpg",
    mall: "musinsa",
    category: "가방",
    discount: 29,
    isLiked: true,
  },
]

interface ProductGridProps {
  subscribedMalls: string[]
}

export function ProductGrid({ subscribedMalls }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedMall, setSelectedMall] = useState<string>("all")
  const [likingProducts, setLikingProducts] = useState<Set<string>>(new Set())

  const filteredProducts = products.filter((product) => {
    const matchesSubscription = subscribedMalls.length === 0 || subscribedMalls.includes(product.mall)
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    const matchesMall = selectedMall === "all" || product.mall === selectedMall

    return matchesSubscription && matchesSearch && matchesCategory && matchesMall
  })

  const categories = Array.from(new Set(products.map((p) => p.category)))
  const availableMalls = Array.from(new Set(products.map((p) => p.mall)))

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
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(amount)
  }

  const toggleLike = (productId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }

    setLikingProducts((prev) => new Set(prev).add(productId))

    setProducts((prev) =>
      prev.map((product) => (product.id === productId ? { ...product, isLiked: !product.isLiked } : product)),
    )

    setTimeout(() => {
      setLikingProducts((prev) => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }, 300)
  }

  const handlePurchase = (product: Product, method: "personal" | "group", groupId?: string) => {
    if (method === "personal") {
      localStorage.setItem("selectedProduct", JSON.stringify(product))
      window.location.href = "/product-payment"
    } else {
      const groupName = familyGroups.find((g) => g.id === groupId)?.name || "선택된 그룹"
      alert(`${product.name}에 대한 ${groupName} 결제 요청을 보냈습니다!`)
    }
  }

  const addToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation()
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existingItem = cart.find((item: any) => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({ ...product, quantity: 1 })
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    alert(`${product.name}이(가) 장바구니에 추가되었습니다!`)
  }

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  if (subscribedMalls.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">구독한 쇼핑몰이 없습니다</h3>
        <p className="text-muted-foreground">쇼핑몰 관리 탭에서 관심 있는 쇼핑몰을 구독해보세요</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="상품명으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="카테고리" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 카테고리</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedMall} onValueChange={setSelectedMall}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="쇼핑몰" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 몰</SelectItem>
              {availableMalls.map((mall) => (
                <SelectItem key={mall} value={mall}>
                  {getMallName(mall)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{filteredProducts.length}개의 상품이 검색되었습니다</p>
        {(searchQuery || selectedCategory !== "all" || selectedMall !== "all") && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery("")
              setSelectedCategory("all")
              setSelectedMall("all")
            }}
          >
            필터 초기화
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="group hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-0" onClick={() => handleProductClick(product)}>
              <div className="relative">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <Badge
                  variant="secondary"
                  className="absolute top-2 left-2 text-xs bg-white/90 text-gray-800 font-medium"
                >
                  {getMallName(product.mall)}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`absolute top-2 right-2 bg-white/80 hover:bg-white transition-all duration-300 ${
                    likingProducts.has(product.id) ? "scale-125" : "scale-100"
                  }`}
                  onClick={(e) => toggleLike(product.id, e)}
                >
                  <Heart
                    className={`h-4 w-4 transition-all duration-300 ${
                      product.isLiked ? "fill-red-500 text-red-500 scale-110" : "hover:text-red-400"
                    } ${likingProducts.has(product.id) ? "animate-pulse" : ""}`}
                  />
                </Button>
                {product.discount && (
                  <Badge className="absolute bottom-2 right-2 bg-red-500">{product.discount}% OFF</Badge>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span className="text-xs text-muted-foreground">
                      {product.rating} ({product.reviewCount})
                    </span>
                  </div>
                </div>

                <h3 className="font-medium text-sm mb-2 line-clamp-2">{product.name}</h3>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-primary">{formatCurrency(product.price)}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatCurrency(product.originalPrice)}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={(e) => addToCart(product, e)}
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    담기
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleProductClick(product)
                    }}
                  >
                    <ShoppingCart className="mr-1 h-3 w-3" />
                    구매
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedProduct(null)
        }}
        onToggleLike={toggleLike}
        onPurchase={handlePurchase}
      />

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">검색 결과가 없습니다</h3>
          <p className="text-muted-foreground">다른 검색어나 필터를 시도해보세요</p>
        </div>
      )}
    </div>
  )
}

const familyGroups = [
  { id: "family1", name: "우리 가족", members: 4 },
  { id: "family2", name: "친척들", members: 8 },
  { id: "couple", name: "부부", members: 2 },
]
