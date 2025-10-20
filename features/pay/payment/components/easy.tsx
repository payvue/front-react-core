"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronRight, CheckCircle2 } from "lucide-react"
import RegisteredPaymentMethod from "./registered"
import { Product } from "@/types"
import { total } from "@/util/bill"
import { providers } from "@/features/pay/types/providers"
import withProcessing, { type AsyncUIProps } from "@/shared/hoc/executor"
import type { Pay } from "@/features/pay/types"
import usePaymetMethod from "@/features/pay/payment/hooks/usePaymentMethod"
import usePaymentEventHandler from "@/features/pay/payment/hooks/usePaymentEventHandler"


type PayModalProps = {
  isOpen: boolean
  onClose: () => void
  product: Product
  onPayment: (method: Pay.Method) => Promise<void>
  onPaySuccess?: () => void
  onPayFailure?: () => void
} & AsyncUIProps

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("ko-KR").format(value)
}

function PayModal({ isProcessing, setup, teardown, isOpen, onClose, product, onPayment }: PayModalProps) {

  const { selected, getMethod, selectMethod } = usePaymetMethod(product)
  usePaymentEventHandler({ onPaymentClosed: () => {
      teardown()
      onClose()
      selectMethod(null)
    }})

  const handlePayment = async () => {
    if (!selected) return
    setup()
    await onPayment(getMethod(selected))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold pr-8">결제 수단 선택</DialogTitle>
          <div className="text-sm text-gray-500 mt-1">
            {product.type} 금액: <span className="font-bold text-primary">{formatCurrency(total(product))}원</span>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-2">

          {/* 간편결제 섹션 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-base">간편결제</h3>
              <span className="text-xs text-gray-500">빠르고 안전한 결제</span>
            </div>
            <div className="space-y-2">
              {providers.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => selectMethod({ type: 'provider', id: provider.id })}
                  disabled={isProcessing}
                  className={`w-full p-4 rounded-lg border transition-all duration-200 ${
                    selected?.type === 'provider' && selected.id === provider.id
                      ? "border-primary bg-primary/5 shadow-sm ring-2 ring-primary/20"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg bg-white border flex items-center justify-center flex-shrink-0 overflow-hidden transition-all duration-200 ${
                      selected?.type === 'provider' && selected.id === provider.id
                        ? "border-primary shadow-sm"
                        : "border-gray-100"
                    }`}>
                      <div className="w-8 h-8 flex items-center justify-center text-2xl font-bold">
                        {provider.id === "naver" && <span className="text-green-500">N</span>}
                        {provider.id === "kakao" && <span className="text-yellow-500">K</span>}
                        {provider.id === "toss" && <span className="text-blue-500">₮</span>}
                      </div>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold transition-colors ${
                          selected?.type === 'provider' && selected.id === provider.id ? 'text-primary' : ''
                        }`}>{provider.name}</span>
                        {provider.badge && (
                          <span className="text-xs bg-primary text-white px-2 py-0.5 rounded">
                            {provider.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{provider.description}</div>
                    </div>
                    {selected?.type === 'provider' && selected.id === provider.id ? (
                      <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 animate-in zoom-in duration-200" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 등록된 결제 수단 섹션 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base">등록된 결제 수단</h3>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                  간편
                </span>              
              </div>
            </div>

            <RegisteredPaymentMethod 
              selectedCard={selected?.type === 'card' ? selected.id : null}
              onCardSelect={(cardId) => selectMethod({ type: 'card', id: cardId })}
              disabled={isProcessing}
            /> 
          </div>

          {/* 결제 정보 요약 */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">{product.type} 금액</span>
                <span className="font-semibold">{formatCurrency(total(product))}원</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">결제 수단</span>
                <span className={`font-semibold ${
                  selected ? 'text-primary' : 'text-gray-400'
                }`}>
                  {selected?.type === 'provider'
                    ? providers.find(p => p.id === selected.id)?.name
                    : selected?.type === 'card'
                    ? "등록된 카드"
                    : "선택 안 됨"}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">수수료</span>
                <span className="font-semibold text-green-600">무료</span>
              </div>
              <div className="border-t border-gray-300 pt-3 flex justify-between items-center">
                <span className="font-bold text-base">최종 결제 금액</span>
                <span className="font-bold text-2xl text-primary">{formatCurrency(total(product))}원</span>
              </div>
            </div>
          </div>

          {/* 결제 버튼 */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 h-12"
              disabled={isProcessing}
            >
              취소
            </Button>
            <Button
              onClick={handlePayment}
              disabled={!selected || isProcessing}
              className={`
                flex-1 h-12 text-base font-semibold flex items-center justify-center
                ${isProcessing
                  ? 'bg-primary text-white cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary/80'}
              `}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  결제 진행 중
                </div>
              ) : (
                "결제하기"
              )}
            </Button>

          </div>

          <p className="text-xs text-center text-gray-500">
            결제 정보는 PCI-DSS 표준에 따라 안전하게 암호화됩니다
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default withProcessing(PayModal)
