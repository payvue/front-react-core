"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Zap, QrCode, Star } from "lucide-react"

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
}

export function QuickPayment() {
  const [paymentAmount, setPaymentAmount] = useState("")
  const [merchant, setMerchant] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const quickAmounts = [5000, 10000, 20000, 50000]

  useEffect(() => {
    const productData = localStorage.getItem("selectedProduct")
    if (productData) {
      const product = JSON.parse(productData)
      setSelectedProduct(product)
      setPaymentAmount(product.price.toString())
      setMerchant(product.mall)
      // Clear the stored product data
      localStorage.removeItem("selectedProduct")
    }
  }, [])

  const getMallName = (mallId: string) => {
    const mallNames: Record<string, string> = {
      coupang: "쿠팡",
      gmarket: "G마켓",
      "11st": "11번가",
      auction: "옥션",
      oliveyoung: "올리브영",
      musinsa: "무신사",
      cafe: "스타벅스",
      convenience: "편의점",
    }
    return mallNames[mallId] || mallId
  }

  const handleQuickPayment = async (amount?: number) => {
    const finalAmount = amount || Number.parseInt(paymentAmount)
    if (!finalAmount || (!merchant && !selectedProduct)) return

    setIsLoading(true)

    // Check user balance
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      if (user.balance < finalAmount) {
        alert("잔액이 부족합니다. 충전 후 다시 시도해주세요.")
        setIsLoading(false)
        return
      }

      // Deduct amount from balance
      user.balance -= finalAmount
      localStorage.setItem("user", JSON.stringify(user))
    }

    // Simulate payment process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsLoading(false)

    if (selectedProduct) {
      alert(`${selectedProduct.name} 상품 결제가 완료되었습니다!`)
    } else {
      alert(`${getMallName(merchant)}에서 ${finalAmount.toLocaleString()}원 결제가 완료되었습니다!`)
    }

    setPaymentAmount("")
    setMerchant("")
    setSelectedProduct(null)
    window.location.reload()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR").format(amount)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          {selectedProduct ? "상품 결제" : "빠른 결제"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {selectedProduct && (
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex gap-4">
              <img
                src={selectedProduct.image || "/placeholder.svg"}
                alt={selectedProduct.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {getMallName(selectedProduct.mall)}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span className="text-xs text-muted-foreground">
                      {selectedProduct.rating} ({selectedProduct.reviewCount})
                    </span>
                  </div>
                </div>
                <h3 className="font-medium text-base mb-2">{selectedProduct.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl font-bold text-primary">{formatCurrency(selectedProduct.price)}원</span>
                  {selectedProduct.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatCurrency(selectedProduct.originalPrice)}원
                    </span>
                  )}
                  {selectedProduct.discount && (
                    <Badge className="bg-red-500 text-xs">{selectedProduct.discount}% OFF</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">카테고리: {selectedProduct.category}</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">결제 예정 금액:</span>
                <span className="font-bold text-lg text-primary">{formatCurrency(selectedProduct.price)}원</span>
              </div>
            </div>
          </div>
        )}

        {!selectedProduct && (
          <div>
            <Label>가맹점 선택</Label>
            <Select value={merchant} onValueChange={setMerchant}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="결제할 가맹점을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="coupang">쿠팡</SelectItem>
                <SelectItem value="gmarket">G마켓</SelectItem>
                <SelectItem value="11st">11번가</SelectItem>
                <SelectItem value="auction">옥션</SelectItem>
                <SelectItem value="oliveyoung">올리브영</SelectItem>
                <SelectItem value="musinsa">무신사</SelectItem>
                <SelectItem value="cafe">스타벅스</SelectItem>
                <SelectItem value="convenience">편의점</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {!selectedProduct && (
          <div>
            <Label className="text-base font-medium">빠른 금액 선택</Label>
            <div className="grid grid-cols-2 gap-3 mt-3">
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  onClick={() => handleQuickPayment(amount)}
                  disabled={!merchant || isLoading}
                  className="h-12"
                >
                  {formatCurrency(amount)}원
                </Button>
              ))}
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="paymentAmount">{selectedProduct ? "결제 금액" : "직접 입력"}</Label>
          <div className="flex gap-2 mt-2">
            <Input
              id="paymentAmount"
              type="number"
              placeholder="결제 금액을 입력하세요"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              disabled={selectedProduct ? true : false}
            />
            <Button
              onClick={() => handleQuickPayment()}
              disabled={!paymentAmount || (!merchant && !selectedProduct) || isLoading}
            >
              {isLoading ? "결제 중..." : "결제"}
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button variant="outline" className="w-full bg-transparent" size="lg">
            <QrCode className="mr-2 h-5 w-5" />
            QR 코드로 결제하기
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
