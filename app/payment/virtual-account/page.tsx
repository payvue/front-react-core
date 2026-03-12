'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import type { Method } from 'axios'
import request from '@/lib/api/client'
import type { PaymentInitiateData } from '@/lib/pay/strategy'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Copy, Landmark, CircleCheck } from 'lucide-react'

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

const PaymentVirtualAccountPage = () => {
  const searchParams = useSearchParams()
  const [payload, setPayload] = useState<PaymentInitiateData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const storageKey = searchParams.get('key')

  useEffect(() => {
    if (!storageKey || typeof window === 'undefined') {
      return
    }

    const raw = window.localStorage.getItem(storageKey)
    if (!raw) {
      return
    }

    try {
      const parsed = JSON.parse(raw) as PaymentInitiateData
      setPayload(parsed)
    } catch {
      setPayload(null)
    }
  }, [storageKey])

  const virtualAccount = payload?.virtualAccount
  const confirm = payload?.confirm
  const bankCode = normalizeBankCode(virtualAccount?.bankCode)
  const bankName = bankNameMap[bankCode] ?? `은행코드 ${bankCode || '-'}`
  const bankIcon = bankIconMap[bankCode]

  const confirmQueryParams = useMemo(() => {
    return {
      ...(confirm?.paymentId ? { paymentId: confirm.paymentId } : {}),
      ...(confirm?.reserveId ? { reserveId: confirm.reserveId } : {}),
      ...(confirm?.resultCode ? { resultCode: confirm.resultCode } : {}),
    }
  }, [confirm?.paymentId, confirm?.reserveId, confirm?.resultCode])

  const handleConfirm = async () => {
    if (!confirm?.payId) {
      alert('결제 확인 정보가 없습니다')
      return
    }

    setIsSubmitting(true)

    try {
      await request({
        method: 'GET' as Method,
        url: `/payment/redirect/confirm/${confirm.payId}`,
        params: confirmQueryParams,
      })

      if (storageKey && typeof window !== 'undefined') {
        window.localStorage.removeItem(storageKey)
      }

      if (window.opener) {
        window.opener.postMessage({ type: 'payment:success' }, '*')
      }

      window.close()
    } catch (error: any) {
      alert(error?.message || '송금 확인 처리에 실패했습니다')
    } finally {
      setIsSubmitting(false)
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

  const handleClose = () => {
    if (storageKey && typeof window !== 'undefined') {
      window.localStorage.removeItem(storageKey)
    }
    window.close()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4">
      <div className="mx-auto max-w-md space-y-4">
        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-4">
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
                  <CardTitle className="text-lg">{bankName}</CardTitle>
                  <p className="text-xs text-muted-foreground">가상계좌 발급 완료</p>
                </div>
              </div>
              <Badge variant="secondary" className="gap-1">
                <CircleCheck className="h-3.5 w-3.5" />
                발급됨
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
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

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <p className="text-xs text-amber-800">
                이체를 완료한 뒤 아래 <b>송금 확인</b> 버튼을 눌러 결제를 마무리하세요.
              </p>
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" className="flex-1" onClick={handleClose} disabled={isSubmitting}>
                닫기
              </Button>
              <Button type="button" className="flex-1" onClick={handleConfirm} disabled={isSubmitting}>
                {isSubmitting ? '확인 중...' : '송금 확인'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground">
              송금 확인 성공 시 이 창은 자동으로 닫히며, 원래 페이지의 결제 상태가 완료로 갱신됩니다.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default PaymentVirtualAccountPage
