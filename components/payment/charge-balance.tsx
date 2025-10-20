"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Wallet } from "lucide-react"
import { usePayContext } from "@/features/pay/contexts/pay"

const chargeAmounts = [10000, 30000, 50000, 100000, 200000, 500000]
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("ko-KR").format(value)

export default function ChargeBalance() {
  const [amount, setAmount] = useState<number | null>(null)
  const { open } = usePayContext()

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
            {chargeAmounts.map((value) => (
              <Button
                key={value}
                variant={amount === value ? "default" : "outline"}
                onClick={() => setAmount(value)}
                className="h-12"
              >
                {formatCurrency(value)}원
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
            value={amount ?? ""}
            onChange={(e) => setAmount(Number(e.target.value) || null)}
            className="mt-2"
          />
        </div>

        <Button
          onClick={() => amount && open({ product: { name: '온라인 캐시 충전', type: '충전', price: amount, amount: 1 } })}
          disabled={!amount}
          className="w-full"
          size="lg"
        >
          {amount ? `${formatCurrency(amount)}원 충전하기` : "충전하기"}
        </Button>
      </CardContent>
    </Card>
  )
}
