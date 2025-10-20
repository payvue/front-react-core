"use client"

import type { Product } from '@/types'

type PaymentSummaryCardProps = {
  productType: Product['type']
  totalAmount: number
  formatAmount: (value: number) => string
  selectedLabel: string
}

const PaymentSummaryCard = ({ productType, totalAmount, formatAmount, selectedLabel }: PaymentSummaryCardProps) => (
  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
    <div className="space-y-3">
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">{productType} 금액</span>
        <span className="font-semibold">{formatAmount(totalAmount)}원</span>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">결제 수단</span>
        <span className={`font-semibold ${selectedLabel !== '선택 안 됨' ? 'text-primary' : 'text-gray-400'}`}>
          {selectedLabel}
        </span>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">수수료</span>
        <span className="font-semibold text-green-600">무료</span>
      </div>
      <div className="border-t border-gray-300 pt-3 flex justify-between items-center">
        <span className="font-bold text-base">최종 결제 금액</span>
        <span className="font-bold text-2xl text-primary">{formatAmount(totalAmount)}원</span>
      </div>
    </div>
  </div>
)

export default PaymentSummaryCard
