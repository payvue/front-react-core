"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wallet, CreditCard } from "lucide-react"

const chargeAmounts = [10000, 30000, 50000, 100000, 200000, 500000]

export function ChargeBalance() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    setCustomAmount("")
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    setSelectedAmount(null)
  }

  const handleCharge = async () => {
    const amount = selectedAmount || Number.parseInt(customAmount)
    if (!amount || !paymentMethod) return

    setIsLoading(true)

    // Simulate charge process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Update user balance in localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      user.balance += amount
      localStorage.setItem("user", JSON.stringify(user))
    }

    setIsLoading(false)
    alert(`${amount.toLocaleString()}원이 충전되었습니다!`)
    window.location.reload()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR").format(amount)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          잔액 충전
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium">충전 금액 선택</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
            {chargeAmounts.map((amount) => (
              <Button
                key={amount}
                variant={selectedAmount === amount ? "default" : "outline"}
                onClick={() => handleAmountSelect(amount)}
                className="h-12"
              >
                {formatCurrency(amount)}원
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="customAmount">직접 입력</Label>
          <Input
            id="customAmount"
            type="number"
            placeholder="충전할 금액을 입력하세요"
            value={customAmount}
            onChange={(e) => handleCustomAmountChange(e.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          <Label>결제 수단</Label>
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="결제 수단을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="card1">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  신한카드 (**** 1234)
                </div>
              </SelectItem>
              <SelectItem value="bank1">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  국민은행 (110-***-*****)
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleCharge}
          disabled={(!selectedAmount && !customAmount) || !paymentMethod || isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading
            ? "충전 중..."
            : `${formatCurrency(selectedAmount || Number.parseInt(customAmount) || 0)}원 충전하기`}
        </Button>
      </CardContent>
    </Card>
  )
}
