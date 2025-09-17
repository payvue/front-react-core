"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CreditCard, Wallet, Plus, ArrowRight } from "lucide-react"

interface GroupBalanceChargeProps {
  groupId: string
  currentUserBalance: number
}

export function GroupBalanceChargeDialog({ groupId, currentUserBalance }: GroupBalanceChargeProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [chargeMethod, setChargeMethod] = useState<"personal" | "card">("personal")
  const [amount, setAmount] = useState("")
  const [selectedCard, setSelectedCard] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const paymentMethods = [
    { id: "card1", name: "신한카드 ****1234", type: "신용카드" },
    { id: "card2", name: "국민카드 ****5678", type: "체크카드" },
    { id: "account1", name: "우리은행 ****9012", type: "계좌" },
  ]

  const quickAmounts = [10000, 30000, 50000, 100000]

  const handleCharge = async () => {
    if (!amount || Number.parseInt(amount) <= 0) return

    setIsLoading(true)

    // 개인 잔액으로 충전하는 경우 잔액 확인
    if (chargeMethod === "personal" && Number.parseInt(amount) > currentUserBalance) {
      alert("개인 잔액이 부족합니다.")
      setIsLoading(false)
      return
    }

    try {
      // API 호출 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 2000))

      alert(`그룹 잔액에 ${Number.parseInt(amount).toLocaleString()}원이 충전되었습니다.`)
      setIsOpen(false)
      setAmount("")
      window.location.reload() // 실제로는 상태 업데이트
    } catch (error) {
      alert("충전 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(amount)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          잔액 충전
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>그룹 잔액 충전</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 충전 방법 선택 */}
          <div className="space-y-3">
            <Label className="text-base font-medium">충전 방법</Label>
            <RadioGroup value={chargeMethod} onValueChange={(value: "personal" | "card") => setChargeMethod(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="personal" id="personal" />
                <Label htmlFor="personal" className="flex items-center gap-2 cursor-pointer">
                  <Wallet className="h-4 w-4" />
                  개인 잔액에서 충전 ({formatCurrency(currentUserBalance)} 보유)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                  <CreditCard className="h-4 w-4" />
                  등록된 결제 수단으로 충전
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* 결제 수단 선택 (카드 충전 시) */}
          {chargeMethod === "card" && (
            <div className="space-y-3">
              <Label className="text-base font-medium">결제 수단</Label>
              <Select value={selectedCard} onValueChange={setSelectedCard}>
                <SelectTrigger>
                  <SelectValue placeholder="결제 수단을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.id} value={method.id}>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <span>{method.name}</span>
                        <span className="text-xs text-muted-foreground">({method.type})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* 충전 금액 */}
          <div className="space-y-3">
            <Label className="text-base font-medium">충전 금액</Label>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(quickAmount.toString())}
                  className="text-xs"
                >
                  {(quickAmount / 10000).toFixed(0)}만원
                </Button>
              ))}
            </div>
            <div className="relative">
              <Input
                type="number"
                placeholder="충전할 금액을 입력하세요"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pr-12"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                원
              </span>
            </div>
            {chargeMethod === "personal" && amount && Number.parseInt(amount) > currentUserBalance && (
              <p className="text-sm text-red-500">개인 잔액이 부족합니다.</p>
            )}
          </div>

          {/* 충전 요약 */}
          {amount && Number.parseInt(amount) > 0 && (
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span>충전 방법:</span>
                  <span className="font-medium">{chargeMethod === "personal" ? "개인 잔액" : "결제 수단"}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span>충전 금액:</span>
                  <span className="font-medium text-primary">{formatCurrency(Number.parseInt(amount))}</span>
                </div>
                {chargeMethod === "personal" && (
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span>충전 후 개인 잔액:</span>
                    <span className="font-medium">{formatCurrency(currentUserBalance - Number.parseInt(amount))}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* 충전 버튼 */}
          <Button
            onClick={handleCharge}
            disabled={
              !amount ||
              Number.parseInt(amount) <= 0 ||
              (chargeMethod === "personal" && Number.parseInt(amount) > currentUserBalance) ||
              (chargeMethod === "card" && !selectedCard) ||
              isLoading
            }
            className="w-full"
          >
            {isLoading ? (
              "충전 중..."
            ) : (
              <>
                충전하기
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
