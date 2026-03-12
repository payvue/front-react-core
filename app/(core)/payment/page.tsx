"use client"

import { PaymentMethods } from "@/features/asset/method/components/payment-methods"
import { OnlineAssets } from "@/features/asset/summary/components/online-assets"
import { MoneyTransfer } from "@/components/payment/money-transfer"
import Recurrent from "@/components/payment/scheduled-payments"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import ChargeBalance from "@/components/payment/charge-balance"
import PayProvider from "@/features/pay/contexts/pay"
import Scheduled from "@/features/pay/recurrent/scheduled/components/scheduled-payment"
import AutoCharge from "@/features/pay/recurrent/charged/components/auto-charge"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef } from "react"
import { usePayContext } from "@/features/pay/contexts/pay"
import { Wallet } from "lucide-react"

const normalizeBankCode = (value?: string) => {
  if (!value) return ''
  return value.padStart(3, '0')
}

function PaymentPendingResumeHandler({
  resumePayId,
}: {
  resumePayId: string | null
}) {
  const { openPendingVirtualAccount } = usePayContext()
  const router = useRouter()
  const hasTriggeredRef = useRef(false)

  useEffect(() => {
    if (!resumePayId) {
      hasTriggeredRef.current = false
      return
    }

    if (hasTriggeredRef.current) {
      return
    }
    hasTriggeredRef.current = true

    const targetPayId = resumePayId === '1' ? undefined : resumePayId
    const opened = openPendingVirtualAccount(targetPayId)
    if (!opened) {
      alert('이어갈 가상계좌 결제 정보가 없습니다')
    }
    router.replace('/payment?tab=charge')
  }, [openPendingVirtualAccount, resumePayId, router])

  return null
}

function PendingPaymentAction() {
  const { openPendingVirtualAccount, pendingVirtualAccounts } = usePayContext()
  const bankNameMap: Record<string, string> = useMemo(
    () => ({
      '088': '신한 은행',
      '004': '국민 은행',
      '006': '국민 은행',
      '020': '우리 은행',
      '011': '농협 은행',
      '081': '하나 은행',
      '003': '기업 은행',
    }),
    []
  )

  const hasPending = pendingVirtualAccounts.length > 0

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold">진행 중인 결제</span>
        <Badge variant={hasPending ? 'default' : 'secondary'} className="text-[10px]">
          {hasPending ? `${pendingVirtualAccounts.length}건` : '없음'}
        </Badge>
      </div>
      {!hasPending ? (
        <p className="text-xs text-muted-foreground">복구할 가상계좌 결제가 없습니다</p>
      ) : (
        <div className="space-y-2">
          {pendingVirtualAccounts.map((item) => {
            const payId = item.issuedPayload.confirm?.payId ?? ''
            const bankCode = normalizeBankCode(item.issuedPayload.virtualAccount?.bankCode)
            const bankName = bankNameMap[bankCode] ?? `은행코드 ${bankCode || '-'}`
            const amount = Number(item.issuedPayload.virtualAccount?.amount ?? 0)
            const accountNumber = item.issuedPayload.virtualAccount?.accountNumber ?? '-'
            const createdAt = new Date(item.createdAt)
            const paymentKindLabel =
              item.paymentKind === 'virtual_account'
                ? '가상계좌 결제'
                : item.paymentKind === 'registered'
                ? '등록 결제'
                : item.paymentKind === 'easypay'
                ? '간편 결제'
                : '결제'
            const paymentModeLabel =
              item.paymentMode === 'multiple'
                ? '다건 결제'
                : item.paymentMode === 'recurrent'
                ? '반복 결제'
                : '단건 결제'
            const createdAtText = Number.isNaN(createdAt.getTime())
              ? item.createdAt
              : new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium', timeStyle: 'short' }).format(createdAt)

            return (
              <div
                key={payId || item.createdAt}
                className="rounded-md border bg-background p-3 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{bankName} · {accountNumber}</p>
                  <p className="text-xs text-muted-foreground">{paymentKindLabel} · {paymentModeLabel}</p>
                  <p className="text-xs text-muted-foreground">
                    {amount.toLocaleString('ko-KR')}원 · 발급 {createdAtText}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">상품: {item.product.name}</p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    const opened = openPendingVirtualAccount(payId)
                    if (!opened) {
                      alert('이어갈 가상계좌 결제 정보가 없습니다')
                    }
                  }}
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  이어서 결제
                </Button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") ?? "charge"
  const resumePayId = searchParams.get("resumeVirtualAccount")

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">결제 관리</h1>
        <p className="text-muted-foreground">결제 수단, 잔액 충전, 온라인 재화를 관리하세요</p>
      </header>
      <Tabs defaultValue={tab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="charge">잔액 충전</TabsTrigger>
            <TabsTrigger value="scheduled">예약 결제</TabsTrigger>
            <TabsTrigger value="assets">온라인 재화</TabsTrigger>
            <TabsTrigger value="transfer">송금</TabsTrigger>
            <TabsTrigger value="methods">결제 수단</TabsTrigger>
          </TabsList>

          <PayProvider> 
            <PaymentPendingResumeHandler resumePayId={resumePayId} />
            <TabsContent value="charge" className="space-y-6">
              <ChargeBalance/>
            </TabsContent>

            <TabsContent value="scheduled" className="space-y-6">
              <Recurrent defaultValue="auto-charge">
                <Recurrent.Tab value="auto-charge" label="자동 충전">
                  <AutoCharge />
                </Recurrent.Tab>
                <Recurrent.Tab value="scheduled" label="예약 결제">
                  <Scheduled />
                </Recurrent.Tab>
              </Recurrent>
            </TabsContent>

            <TabsContent value="assets" className="space-y-6">
              <OnlineAssets />
            </TabsContent>

            <TabsContent value="transfer" className="space-y-6">
              <MoneyTransfer />
            </TabsContent>

            <TabsContent value="methods" className="space-y-6">
              <PaymentMethods />
            </TabsContent>

            <PendingPaymentAction />
          </PayProvider>            
      </Tabs>
    </div>
  )
}
