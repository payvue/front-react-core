"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import type { Method } from "axios"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import request from "@/lib/api/client"
import ProviderSelection from "./provider-selection"
import RegisteredMethodSection from "./registered-method-section"
import PaymentSummaryCard from "./payment-summary-card"
import withProcessing, { type AsyncUIProps } from "@/shared/hoc/executor"
import type { Pay } from "@/features/pay/types"
import type { Product } from "@/types"
import usePaymentModal from "@/features/pay/payment/hooks/usePaymentModal"
import { responseCode } from "@/features/apis"
import type APIResponse from "@/lib/api/types/response"
import type { PaymentInitiateData } from "@/lib/pay/strategy"
import { Badge } from "@/components/ui/badge"
import { Copy, Landmark, CircleCheck } from "lucide-react"
import { usePaymentMethodsState } from "@/features/asset/method/hooks/usePaymentMethodsState"
import {
  appendVirtualAccountPending,
  removeVirtualAccountPending,
  type VirtualAccountPendingData,
} from "@/features/pay/utils/virtual-account-pending"

type PayModalProps = {
  isOpen: boolean
  onClose: () => void
  product: Product
  onPayment: (method: Pay.Method) => Promise<void>
  onVirtualAccountConfirmed: () => Promise<void>
  resumeVirtualAccount?: VirtualAccountPendingData | null
} & AsyncUIProps

const bankNameMap: Record<string, string> = {
  '088': '신한 은행',
  '004': '국민 은행',
  '020': '우리 은행',
  '011': '농협 은행',
  '081': '하나 은행',
}

const bankIconMap: Record<string, string> = {
  '088': 'https://www.google.com/s2/favicons?domain=shinhan.com&sz=64',
  '004': 'https://www.google.com/s2/favicons?domain=kbstar.com&sz=64',
  '020': 'https://www.google.com/s2/favicons?domain=wooribank.com&sz=64',
  '011': 'https://www.google.com/s2/favicons?domain=nhbank.com&sz=64',
  '081': 'https://www.google.com/s2/favicons?domain=kebhana.com&sz=64',
}

const normalizeBankCode = (value?: string) => {
  if (!value) return ''
  return value.padStart(3, '0')
}

function PayModal({
  isProcessing,
  setup,
  teardown,
  isOpen,
  onClose,
  product,
  onPayment,
  onVirtualAccountConfirmed,
  resumeVirtualAccount,
}: PayModalProps) {
  const processing = Boolean(isProcessing)
  const [step, setStep] = useState<'method' | 'virtualAccountSelect' | 'virtualAccountIssued'>('method')
  const [tossChannel, setTossChannel] = useState<'easypay' | 'virtual_account'>('easypay')
  const [bankCode, setBankCode] = useState<Pay.BankCode | ''>('')
  const [issuedPayload, setIssuedPayload] = useState<PaymentInitiateData | null>(null)
  const bankOptions = useMemo(
    () => [
      {
        code: '088' as Pay.BankCode,
        name: '신한 은행',
        iconUrl: 'https://www.google.com/s2/favicons?domain=shinhan.com&sz=64',
      },
      {
        code: '004' as Pay.BankCode,
        name: '국민 은행',
        iconUrl: 'https://www.google.com/s2/favicons?domain=kbstar.com&sz=64',
      },
      {
        code: '020' as Pay.BankCode,
        name: '우리 은행',
        iconUrl: 'https://www.google.com/s2/favicons?domain=wooribank.com&sz=64',
      },
      {
        code: '011' as Pay.BankCode,
        name: '농협 은행',
        iconUrl: 'https://www.google.com/s2/favicons?domain=nhbank.com&sz=64',
      },
      {
        code: '081' as Pay.BankCode,
        name: '하나 은행',
        iconUrl: 'https://www.google.com/s2/favicons?domain=kebhana.com&sz=64',
      },
    ],
    []
  )

  const {
    selected,
    totalAmount,
    selectedLabel,
    formatCurrency,
    handleDialogChange,
    handleProviderSelect,
    handleCardSelect,
    handlePayment,
    handleClose
  } = usePaymentModal({
    product,
    onClose,
    onPayment,
    setup,
    teardown,
    options: {
      tossChannel,
      bankCode,
    }
  })
  const { activeMethods: paymentMethods, isLoading: isPaymentMethodsLoading } = usePaymentMethodsState()

  const selectedProviderId = selected?.type === 'provider' ? selected.id : null
  const showTossChannel = selectedProviderId === 'toss'
  const isVirtualAccountSelectStep = step === 'virtualAccountSelect'
  const isVirtualAccountIssuedStep = step === 'virtualAccountIssued'
  const virtualAccount = issuedPayload?.virtualAccount
  const confirm = issuedPayload?.confirm
  const normalizedBankCode = normalizeBankCode(virtualAccount?.bankCode || bankCode)
  const bankName = bankNameMap[normalizedBankCode] ?? `은행코드 ${normalizedBankCode || '-'}`
  const bankIcon = bankIconMap[normalizedBankCode]

  useEffect(() => {
    if (!showTossChannel && step !== 'method' && !resumeVirtualAccount) {
      setStep('method')
      setTossChannel('easypay')
      setBankCode('')
      setIssuedPayload(null)
    }
  }, [resumeVirtualAccount, showTossChannel, step])

  useEffect(() => {
    if (!isOpen || !resumeVirtualAccount) {
      return
    }

    setIssuedPayload(resumeVirtualAccount.issuedPayload)
    setTossChannel('virtual_account')
    setStep('virtualAccountIssued')
    handleProviderSelect('toss')
  }, [handleProviderSelect, isOpen, resumeVirtualAccount])

  useEffect(() => {
    if (!isOpen) {
      setStep('method')
      setTossChannel('easypay')
      setBankCode('')
      setIssuedPayload(null)
    }
  }, [isOpen])

  const handlePaymentClick = async () => {
    try {
      await handlePayment()
    } catch (error) {
      const message = error instanceof Error ? error.message : '결제 요청 중 오류가 발생했습니다'
      alert(message)
    }
  }

  const handlePrimaryClick = () => {
    if (isVirtualAccountIssuedStep) {
      void confirmVirtualAccountTransfer()
      return
    }

    if (isVirtualAccountSelectStep && !bankCode) {
      alert('입금할 은행을 선택해주세요')
      return
    }

    if (isVirtualAccountSelectStep) {
      void issueVirtualAccount()
      return
    }

    if (!selected) {
      alert('결제 수단을 먼저 선택해주세요')
      return
    }

    if (showTossChannel && step === 'method') {
      setTossChannel('virtual_account')
      setStep('virtualAccountSelect')
      return
    }

    void handlePaymentClick()
  }

  const handleBackToMethod = () => {
    setStep('method')
  }

  const issueVirtualAccount = async () => {
    if (!bankCode) {
      alert('입금할 은행을 선택해주세요')
      return
    }

    setup()

    try {
      const response = await request({
        method: 'POST' as Method,
        url: '/payment/toss/virtual_account/reserve',
        data: {
          name: product.name,
          type: product.type,
          price: product.price,
          amount: product.amount,
          bankCode,
        },
      }) as APIResponse<PaymentInitiateData>

      if (response.code !== responseCode.SUCCESS) {
        throw new Error(response.message || '가상계좌 발급에 실패했습니다')
      }

      const nextPayload = response.data ?? null
      setIssuedPayload(nextPayload)
      setStep('virtualAccountIssued')
      if (nextPayload) {
        appendVirtualAccountPending({
          issuedPayload: nextPayload,
          product,
          createdAt: new Date().toISOString(),
          paymentKind: 'virtual_account',
          paymentMode: 'single',
        })
      }
    } catch (error: any) {
      alert(error?.message || '가상계좌 발급에 실패했습니다')
    } finally {
      teardown()
    }
  }

  const handleCopyAccount = async () => {
    const accountNumber = virtualAccount?.accountNumber
    if (!accountNumber) {
      return
    }

    try {
      await navigator.clipboard.writeText(accountNumber)
      alert('계좌번호를 복사했습니다')
    } catch {
      alert('계좌번호 복사에 실패했습니다')
    }
  }

  const formattedDueDate = useMemo(() => {
    if (!virtualAccount?.dueDate) {
      return '-'
    }

    const date = new Date(virtualAccount.dueDate)
    if (Number.isNaN(date.getTime())) {
      return virtualAccount.dueDate
    }

    return new Intl.DateTimeFormat('ko-KR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date)
  }, [virtualAccount?.dueDate])

  const confirmVirtualAccountTransfer = async () => {
    if (!confirm?.payId) {
      alert('결제 확인 정보가 없습니다')
      return
    }

    setup()

    try {
      const resolvedResultCode = confirm.resultCode ?? 'Success'

      const response = await request({
        method: 'GET' as Method,
        url: `/payment/redirect/confirm/${confirm.payId}`,
        params: {
          ...(confirm.paymentId ? { paymentId: confirm.paymentId } : {}),
          ...(confirm.reserveId ? { reserveId: confirm.reserveId } : {}),
          resultCode: resolvedResultCode,
        },
      }) as APIResponse

      if (response.code && response.code !== responseCode.SUCCESS) {
        throw new Error(response.message || '송금 확인 처리에 실패했습니다')
      }

      removeVirtualAccountPending(confirm.payId)
      await onVirtualAccountConfirmed()
      handleClose()
    } catch (error: any) {
      alert(error?.message || '송금 확인 처리에 실패했습니다')
    } finally {
      teardown()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold pr-8">결제 수단 선택</DialogTitle>
          <div className="text-sm text-gray-500 mt-1">
            {product.type} 금액: <span className="font-bold text-primary">{formatCurrency(totalAmount)}원</span>
          </div>
        </DialogHeader>

        <div className="pt-2">
          <AnimatePresence mode="wait" initial={false}>
            {step === 'method' ? (
              <motion.div
                key="method"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="space-y-6 min-h-[320px]"
              >
                <ProviderSelection selected={selected} disabled={processing} onSelect={handleProviderSelect} />
                <RegisteredMethodSection
                  methods={paymentMethods}
                  selected={selected}
                  onSelectCard={handleCardSelect}
                  disabled={processing}
                  isLoading={isPaymentMethodsLoading}
                />
              </motion.div>
            ) : isVirtualAccountSelectStep ? (
              <motion.div
                key="virtual-account"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="space-y-3 rounded-lg border p-4 min-h-[320px]"
              >
                <h3 className="font-semibold text-base">입금할 은행을 선택하세요</h3>
                <p className="text-sm text-gray-600">토스페이 가상계좌 발급 후 선택한 은행으로 입금할 수 있습니다</p>

                <div className="space-y-2 pt-2">
                  {bankOptions.map((bank) => {
                    const isSelected = bankCode === bank.code

                    return (
                      <button
                        key={bank.code}
                        type="button"
                        className={`w-full rounded-lg border px-4 py-3 transition ${
                          isSelected
                            ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => setBankCode(bank.code)}
                        disabled={processing}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={bank.iconUrl}
                            alt={bank.name}
                            className="h-8 w-8 rounded-md border border-gray-200 bg-white p-1"
                          />
                          <div className="text-left">
                            <p className="text-sm font-semibold">{bank.name}</p>
                            <p className="text-xs text-gray-500">은행코드 {bank.code}</p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="virtual-account-issued"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="space-y-4 rounded-lg border p-4 min-h-[320px]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border">
                      {bankIcon ? (
                        <img src={bankIcon} alt={bankName} className="h-7 w-7" />
                      ) : (
                        <Landmark className="h-5 w-5 text-slate-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-base">{bankName}</h3>
                      <p className="text-xs text-muted-foreground">가상계좌 발급 완료</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="gap-1">
                    <CircleCheck className="h-3.5 w-3.5" />
                    발급됨
                  </Badge>
                </div>

                <div className="rounded-lg border p-4 bg-slate-50/60">
                  <p className="text-xs text-muted-foreground mb-1">입금 계좌번호</p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-lg font-semibold tracking-wide">{virtualAccount?.accountNumber ?? '-'}</p>
                    <Button variant="outline" size="sm" type="button" onClick={handleCopyAccount}>
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      복사
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">예금주</p>
                    <p className="font-medium mt-1">{virtualAccount?.customerName ?? '-'}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">입금금액</p>
                    <p className="font-semibold mt-1">{Number(virtualAccount?.amount ?? 0).toLocaleString('ko-KR')}원</p>
                  </div>
                  <div className="rounded-lg border p-3 col-span-2">
                    <p className="text-xs text-muted-foreground">입금기한</p>
                    <p className="font-medium mt-1">{formattedDueDate}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-6 pt-4">
            <PaymentSummaryCard
              productType={product.type}
              totalAmount={totalAmount}
              selectedLabel={selectedLabel}
              formatAmount={formatCurrency}
            />

            <div className="flex gap-3 pt-2">
              {isVirtualAccountSelectStep ? (
                <Button variant="outline" onClick={handleBackToMethod} className="flex-1 h-12" disabled={processing}>
                  이전
                </Button>
              ) : isVirtualAccountIssuedStep ? (
                <Button variant="outline" onClick={handleClose} className="flex-1 h-12" disabled={processing}>
                  닫기
                </Button>
              ) : (
                <Button variant="outline" onClick={handleClose} className="flex-1 h-12" disabled={processing}>
                  취소
                </Button>
              )}
              <Button
                onClick={handlePrimaryClick}
                disabled={
                  processing ||
                  (isVirtualAccountSelectStep && !bankCode) ||
                  (!selected && !isVirtualAccountIssuedStep)
                }
                className={`flex-1 h-12 text-base font-semibold flex items-center justify-center ${
                  processing ? "bg-primary text-white cursor-not-allowed" : "bg-primary text-white hover:bg-primary/80"
                }`}
              >
                {processing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    결제 진행 중
                  </div>
                ) : (
                  showTossChannel && step === 'method'
                    ? "다음"
                    : isVirtualAccountSelectStep
                    ? "가상계좌 발급"
                    : isVirtualAccountIssuedStep
                    ? "송금 확인"
                    : "결제하기"
                )}
              </Button>
            </div>

            <p className="text-xs text-center text-gray-500">
              결제 정보는 PCI-DSS 표준에 따라 안전하게 암호화됩니다
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default withProcessing(PayModal)
