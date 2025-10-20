"use client"

import type { SelectedMethod } from '@/features/pay/payment/model/SelectedMethod'
import RegisteredPaymentMethod from './registered'

type RegisteredMethodSectionProps = {
  selected: SelectedMethod
  disabled: boolean
  onSelectCard: (cardId: string | null) => void
}

const RegisteredMethodSection = ({ selected, disabled, onSelectCard }: RegisteredMethodSectionProps) => (
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
      onCardSelect={onSelectCard}
      disabled={disabled}
    />
  </div>
)

export default RegisteredMethodSection
