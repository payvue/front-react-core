"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Star, Coins, Wallet, Building2, Smartphone, CheckCircle, AlertTriangle } from "lucide-react"

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

interface UserData {
  balance: number
  points: number
  creditLimit: number
  usedCredit: number
}

interface PaymentMethod {
  id: string
  type: "balance" | "credit" | "card" | "mobile"
  name: string
  description: string
  icon: React.ReactNode
  available: boolean
  limit?: number
  used?: number
}

export function ProductPayment() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [userData, setUserData] = useState<UserData>({
    balance: 0,
    points: 0,
    creditLimit: 500000,
    usedCredit: 120000,
  })
  const [usePoints, setUsePoints] = useState(0)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("balance")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load product data from localStorage
    const productData = localStorage.getItem("selectedProduct")
    if (productData) {
      setSelectedProduct(JSON.parse(productData))
    }

    // Load user data
    const userDataStr = localStorage.getItem("user")
    if (userDataStr) {
      const user = JSON.parse(userDataStr)
      setUserData({
        balance: user.balance || 150000,
        points: user.points || 5000,
        creditLimit: user.creditLimit || 500000,
        usedCredit: user.usedCredit || 120000,
      })
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR").format(amount)
  }

  const finalAmount = selectedProduct ? selectedProduct.price - usePoints : 0
  const maxPoints = selectedProduct ? Math.min(userData.points, selectedProduct.price) : 0
  const availableCredit = userData.creditLimit - userData.usedCredit

  const paymentMethods: PaymentMethod[] = [
    {
      id: "balance",
      type: "balance",
      name: "계좌 잔액",
      description: `사용 가능: ${formatCurrency(userData.balance)}원`,
      icon: <Wallet className="h-4 w-4 text-blue-500" />,
      available: userData.balance >= finalAmount,
    },
    {
      id: "credit",
      type: "credit",
      name: "신용 한도",
      description: `사용 가능: ${formatCurrency(availableCredit)}원 / ${formatCurrency(userData.creditLimit)}원`,
      icon: <Building2 className="h-4 w-4 text-purple-500" />,
      available: availableCredit >= finalAmount,
      limit: userData.creditLimit,
      used: userData.usedCredit,
    },
    {
      id: "card",
      type: "card",
      name: "신용카드",
      description: "등록된 카드로 결제",
      icon: <CreditCard className="h-4 w-4 text-green-500" />,
      available: true,
    },
    {
      id: "mobile",
      type: "mobile",
      name: "휴대폰 결제",
      description: "통신사 결제 서비스",
      icon: <Smartphone className="h-4 w-4 text-orange-500" />,
      available: true,
    },
  ]

  const selectedMethod = paymentMethods.find((method) => method.id === selectedPaymentMethod)
  const canPay = selectedMethod?.available && finalAmount > 0

  const handlePayment = async () => {
    if (!selectedProduct || !canPay) return

    setIsLoading(true)

    // Simulate payment process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Update user data based on payment method
    const updatedUser = {
      ...JSON.parse(localStorage.getItem("user") || "{}"),
      points: userData.points - usePoints,
    }

    if (selectedPaymentMethod === "balance") {
      updatedUser.balance = userData.balance - finalAmount
    } else if (selectedPaymentMethod === "credit") {
      updatedUser.usedCredit = userData.usedCredit + finalAmount
    }

    localStorage.setItem("user", JSON.stringify(updatedUser))
    localStorage.removeItem("selectedProduct")

    setIsLoading(false)
    alert(`${selectedProduct.name} 상품 결제가 완료되었습니다!`)
    window.location.href = "/shopping"
  }

  if (!selectedProduct) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">결제할 상품이 선택되지 않았습니다.</p>
          <Button
            variant="outline"
            className="mt-4 bg-transparent"
            onClick={() => (window.location.href = "/shopping")}
          >
            쇼핑하러 가기
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* User Balance and Credit Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">보유 잔액</p>
                <p className="text-xl font-bold text-blue-600">{formatCurrency(userData.balance)}원</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">신용 한도</p>
                <p className="text-xl font-bold text-purple-600">{formatCurrency(availableCredit)}원</p>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(userData.usedCredit)} / {formatCurrency(userData.creditLimit)} 사용중
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-amber-500" />
              <div>
                <p className="text-sm text-muted-foreground">보유 포인트</p>
                <p className="text-xl font-bold text-amber-600">{formatCurrency(userData.points)}P</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            상품 결제
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
          </div>

          {/* Point Usage */}
          <div className="space-y-3">
            <Label className="text-base font-medium">포인트 사용</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="0"
                value={usePoints}
                onChange={(e) => setUsePoints(Math.min(Number(e.target.value) || 0, maxPoints))}
                max={maxPoints}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">P</span>
              <Button variant="outline" size="sm" onClick={() => setUsePoints(maxPoints)}>
                전액 사용
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">최대 {formatCurrency(maxPoints)}P까지 사용 가능</p>
          </div>

          <Separator />

          <div className="space-y-4">
            <Label className="text-base font-medium">결제 수단 선택</Label>
            <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={method.id} id={method.id} disabled={!method.available} />
                  <Label
                    htmlFor={method.id}
                    className={`flex-1 flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedPaymentMethod === method.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50"
                    } ${!method.available ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      {method.icon}
                      <div>
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {method.available ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                      {method.type === "credit" && (
                        <div className="text-right">
                          <div className="w-20 bg-muted rounded-full h-2">
                            <div
                              className="bg-purple-500 h-2 rounded-full transition-all"
                              style={{ width: `${(method.used! / method.limit!) * 100}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {Math.round((method.used! / method.limit!) * 100)}% 사용
                          </p>
                        </div>
                      )}
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Separator />

          {/* Payment Summary */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>상품 금액</span>
              <span>{formatCurrency(selectedProduct.price)}원</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>포인트 사용</span>
              <span className="text-amber-600">-{formatCurrency(usePoints)}P</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="font-medium">최종 결제 금액</span>
              <span className="text-xl font-bold text-primary">{formatCurrency(finalAmount)}원</span>
            </div>
            {selectedMethod && (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>결제 수단</span>
                <span>{selectedMethod.name}</span>
              </div>
            )}
          </div>

          <Button onClick={handlePayment} disabled={isLoading || !canPay} className="w-full h-12" size="lg">
            {isLoading ? "결제 중..." : `${formatCurrency(finalAmount)}원 결제하기`}
          </Button>

          {!canPay && finalAmount > 0 && (
            <p className="text-sm text-red-500 text-center">
              선택한 결제 수단으로 결제할 수 없습니다. 다른 결제 수단을 선택해주세요.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
