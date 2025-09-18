"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Heart, ShoppingCart, Users, ExternalLink, X } from "lucide-react"

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

interface ProductModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onToggleLike: (productId: string) => void
  onPurchase: (product: Product, method: "personal" | "group", groupId?: string) => void
}

const familyGroups = [
  { id: "family1", name: "우리 가족", members: 4 },
  { id: "family2", name: "친척들", members: 8 },
  { id: "couple", name: "부부", members: 2 },
]

export function ProductModal({ product, isOpen, onClose, onToggleLike, onPurchase }: ProductModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<"personal" | "group">("personal")
  const [selectedGroup, setSelectedGroup] = useState<string>("")
  const [showIframe, setShowIframe] = useState(false)
  const [isLiked, setIsLiked] = useState<boolean>(product?.isLiked ?? false)

  useEffect(() => {
    setIsLiked(product?.isLiked ?? false)
  }, [product?.id, product?.isLiked])

  if (!product) return null

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

  const getMallUrl = (mallId: string, productName: string) => {
    const searchQuery = encodeURIComponent(productName)
    const mallUrls: Record<string, string> = {
      coupang: `https://www.coupang.com/np/search?q=${searchQuery}`,
      gmarket: `https://browse.gmarket.co.kr/search?keyword=${searchQuery}`,
      "11st": `https://search.11st.co.kr/Search.tmall?kwd=${searchQuery}`,
      auction: `https://search.auction.co.kr/search?keyword=${searchQuery}`,
      oliveyoung: `https://www.oliveyoung.co.kr/store/search/getSearchMain.do?query=${searchQuery}`,
      musinsa: `https://www.musinsa.com/search/musinsa/goods?q=${searchQuery}`,
    }
    return mallUrls[mallId] || `https://www.google.com/search?q=${searchQuery}`
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR").format(amount)
  }

  const handlePurchase = () => {
    if (paymentMethod === "group" && !selectedGroup) {
      alert("결제를 요청할 그룹을 선택해주세요.")
      return
    }
    onPurchase(product, paymentMethod, selectedGroup)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col" showCloseButton={false}>
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center justify-between">
            <span>상품 상세 정보</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Product Info */}
          <div className="flex gap-6">
            <div className="relative flex-shrink-0">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-48 h-48 object-cover rounded-lg"
              />
              <Badge
                variant="secondary"
                className="absolute top-2 left-2 text-xs bg-white/90 text-gray-800 font-medium"
              >
                {getMallName(product.mall)}
              </Badge>
              {product.discount && (
                <Badge className="absolute bottom-2 right-2 bg-red-500">{product.discount}% OFF</Badge>
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-muted-foreground">
                      {product.rating} ({product.reviewCount}개 리뷰)
                    </span>
                  </div>
                </div>

                <h2 className="text-xl font-bold mb-3">{product.name}</h2>

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-bold text-primary">{formatCurrency(product.price)}원</span>
                  {product.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      {formatCurrency(product.originalPrice)}원
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsLiked((prev) => !prev)
                      onToggleLike(product.id)
                    }}
                    className="flex items-center gap-2 transition-all duration-300 hover:scale-105"
                  >
                    <Heart
                      className={`h-4 w-4 transition-all duration-300 ${
                        isLiked ? "fill-red-500 text-red-500 scale-110" : "hover:text-red-400"
                      }`}
                    />
                    {isLiked ? "좋아요 취소" : "좋아요"}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowIframe(!showIframe)}
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {showIframe ? "상품 정보 닫기" : "상품 정보 보기"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details iframe */}
          {showIframe && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">상품 상세 정보</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowIframe(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <iframe
                  src={getMallUrl(product.mall, product.name)}
                  className="w-full h-96"
                  title={`${product.name} 상품 정보`}
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                * 실제 쇼핑몰 페이지가 표시됩니다. 구매는 아래 결제 옵션을 이용해주세요.
              </p>
            </div>
          )}

          <Separator />

          {/* Payment Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">결제 방법 선택</h3>

            <RadioGroup value={paymentMethod} onValueChange={(value: "personal" | "group") => setPaymentMethod(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="personal" id="personal" />
                <Label htmlFor="personal" className="cursor-pointer">
                  개인 결제 (즉시 결제)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="group" id="group" />
                <Label htmlFor="group" className="flex items-center gap-2 cursor-pointer">
                  <Users className="h-4 w-4" />
                  가족 계정 결제 요청
                </Label>
              </div>
            </RadioGroup>

            {paymentMethod === "group" && (
              <div className="ml-6 space-y-2">
                <Label className="text-sm font-medium">결제 요청할 그룹 선택</Label>
                <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="그룹을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {familyGroups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name} ({group.members}명)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex-shrink-0 pt-4 border-t">
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              취소
            </Button>
            <Button onClick={handlePurchase} className="flex-1">
              <ShoppingCart className="mr-2 h-4 w-4" />
              {paymentMethod === "personal" ? "즉시 결제" : "결제 요청 보내기"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
