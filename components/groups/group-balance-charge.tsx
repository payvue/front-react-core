'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { usePayContext } from '@/features/pay/contexts/pay'
import { useCreateTransfer } from '@/features/transfer/useTransferQuery'
import { useAppSelector } from '@/lib/redux/hooks'
import useAsyncAccountQuery from '@/features/account/useAsyncAccountQuery'
import { useUserContext } from '@/components/context/user'
import { useCommunityContext } from '@/components/context/community'
import { usePaymentMethodsState } from '@/features/asset/method/hooks/usePaymentMethodsState'
import type { PaymentMethodType } from '@/features/asset/method/types/payment-method'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { CreditCard, Wallet, Plus, ArrowRight } from 'lucide-react'

interface GroupBalanceChargeProps {
  groupId: string
  currentUserBalance: number
  onChargeSuccess?: () => void
}

export function GroupBalanceChargeDialog({
  groupId,
  currentUserBalance,
  onChargeSuccess,
}: GroupBalanceChargeProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [chargeMethod, setChargeMethod] = useState<'personal' | 'card'>('personal')
  const [amount, setAmount] = useState('')
  const [selectedCard, setSelectedCard] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const pay = usePayContext()
  const { account } = useAppSelector((state) => state.auth.domain)
  const createTransfer = useCreateTransfer()
  const { isAuthenticated } = useUserContext()
  const { fetch } = useAsyncAccountQuery(() => isAuthenticated, true)
  const { newIssued } = useCommunityContext()
  const { activeMethods: paymentMethods, isLoading: isPaymentMethodsLoading } = usePaymentMethodsState()

  const quickAmounts = [10000, 30000, 50000, 100000]

  const paymentTypeLabel: Record<PaymentMethodType, string> = {
    card: '카드',
    bank: '계좌',
    mobile: '휴대폰',
    wallet: '지갑',
  }

  useEffect(() => {
    if (chargeMethod !== 'card') {
      return
    }

    if (selectedCard && paymentMethods.some((method) => method.id === selectedCard)) {
      return
    }

    setSelectedCard(paymentMethods[0]?.id ?? '')
  }, [chargeMethod, paymentMethods, selectedCard])

  const handleCharge = () => {
    if (!amount || Number.parseInt(amount) <= 0) return

    // 개인 잔액으로 충전하는 경우 검증
    if (chargeMethod === 'personal' && Number.parseInt(amount) > currentUserBalance) {
      alert('개인 잔액이 부족합니다.')
      return
    }

    // 카드 선택 검증
    if (chargeMethod === 'card' && !selectedCard) {
      alert('결제 수단을 선택해주세요.')
      return
    }

    const amountValue = Number.parseInt(amount)

    if (chargeMethod === 'personal') {
      if (!groupId) {
        alert('수신 커뮤니티 정보를 확인할 수 없습니다.')
        return
      }

      setIsLoading(true)
      createTransfer
        .mutateAsync({
          recipientId: groupId,
          amount: amountValue,
          currency: 'KRW',
          message: '그룹 잔액 충전',
        })
        .then(async () => {
          await fetch()
          newIssued()
          setIsOpen(false)
          setAmount('')
          setChargeMethod('personal')
          setSelectedCard('')
          onChargeSuccess?.()
          alert('그룹 잔액이 충전되었습니다.')
        })
        .catch((error: any) => {
          alert(error?.message || '그룹 잔액 충전에 실패했습니다.')
        })
        .finally(() => {
          setIsLoading(false)
        })
      return
    }

    // Product 형태로 결제 모듈에 전달
    const chargeProduct = {
      name: `그룹 잔액 충전 (${amountValue.toLocaleString()}원)`,
      type: 'group-charge',
      price: amountValue,
      amount: 1,
    }

    // 결제 모달 열기
    try {
      setIsLoading(true)
      pay.open({ product: chargeProduct, mode: 'SINGLE' })

      // 결제 창에서 완료되면 전역 메시지로 알림이 옴
      const handleMessage = (event: MessageEvent) => {
        if (event.data === 'PAYMENT_CLOSED') {
          window.removeEventListener('message', handleMessage)
          setIsLoading(false)
          setIsOpen(false)
          setAmount('')
          setChargeMethod('personal')
          setSelectedCard('')
          // 콜백 호출
          onChargeSuccess?.()
        }
      }

      window.addEventListener('message', handleMessage)
    } catch (err) {
      setIsLoading(false)
      alert('결제 모달을 열 수 없습니다.')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
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
            <RadioGroup
              value={chargeMethod}
              onValueChange={(value: 'personal' | 'card') => setChargeMethod(value)}
            >
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
          {chargeMethod === 'card' && (
            <div className="space-y-3">
              <Label className="text-base font-medium">결제 수단</Label>
              <Select value={selectedCard} onValueChange={setSelectedCard}>
                <SelectTrigger>
                  <SelectValue placeholder="결제 수단을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {isPaymentMethodsLoading ? (
                    <div className="px-2 py-2 text-xs text-muted-foreground">
                      결제 수단을 불러오는 중입니다
                    </div>
                  ) : paymentMethods.length === 0 ? (
                    <div className="px-2 py-2 text-xs text-muted-foreground">
                      등록된 결제 수단이 없습니다
                    </div>
                  ) : (
                    paymentMethods.map((method) => (
                      <SelectItem key={method.id} value={method.id}>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          <span>{method.name}</span>
                          {method.details ? (
                            <span className="text-xs text-muted-foreground">{method.details}</span>
                          ) : null}
                          <span className="text-xs text-muted-foreground">
                            ({paymentTypeLabel[method.type]})
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  )}
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
            {chargeMethod === 'personal' &&
              amount &&
              Number.parseInt(amount) > currentUserBalance && (
                <p className="text-sm text-red-500">개인 잔액이 부족합니다.</p>
              )}
          </div>

          {/* 충전 요약 */}
          {amount && Number.parseInt(amount) > 0 && (
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span>충전 방법:</span>
                  <span className="font-medium">
                    {chargeMethod === 'personal' ? '개인 잔액' : '결제 수단'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span>충전 금액:</span>
                  <span className="font-medium text-primary">
                    {formatCurrency(Number.parseInt(amount))}
                  </span>
                </div>
                {chargeMethod === 'personal' && (
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span>충전 후 개인 잔액:</span>
                    <span className="font-medium">
                      {formatCurrency(currentUserBalance - Number.parseInt(amount))}
                    </span>
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
              (chargeMethod === 'personal' && Number.parseInt(amount) > currentUserBalance) ||
              (chargeMethod === 'card' && (!selectedCard || paymentMethods.length === 0)) ||
              isLoading
            }
            className="w-full"
          >
            {isLoading ? (
              '충전 중...'
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
