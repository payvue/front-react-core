"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import ProviderSelection from "./provider-selection"
import RegisteredMethodSection from "./registered-method-section"
import PaymentSummaryCard from "./payment-summary-card"
import withProcessing, { type AsyncUIProps } from "@/shared/hoc/executor"
import type { Pay } from "@/features/pay/types"
import type { Product } from "@/types"
import usePaymentModal from "@/features/pay/payment/hooks/usePaymentModal"

type PayModalProps = {
  isOpen: boolean
  onClose: () => void
  product: Product
  onPayment: (method: Pay.Method) => Promise<void>
} & AsyncUIProps

function PayModal({ isProcessing, setup, teardown, isOpen, onClose, product, onPayment }: PayModalProps) {
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
    teardown
  })

  const handlePaymentClick = () => {
    void handlePayment()
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

        <div className="space-y-6 pt-2">
          <ProviderSelection selected={selected} disabled={isProcessing} onSelect={handleProviderSelect} />

          <RegisteredMethodSection selected={selected} onSelectCard={handleCardSelect} disabled={isProcessing} />

          <PaymentSummaryCard
            productType={product.type}
            totalAmount={totalAmount}
            selectedLabel={selectedLabel}
            formatAmount={formatCurrency}
          />

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={handleClose} className="flex-1 h-12" disabled={isProcessing}>
              취소
            </Button>
            <Button
              onClick={handlePaymentClick}
              disabled={!selected || isProcessing}
              className={`flex-1 h-12 text-base font-semibold flex items-center justify-center ${
                isProcessing ? "bg-primary text-white cursor-not-allowed" : "bg-primary text-white hover:bg-primary/80"
              }`}
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
