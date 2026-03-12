"use client"

import type { SelectedMethod } from '@/features/pay/payment/model/SelectedMethod'
import type { PaymentMethodModel } from '@/features/asset/method/model/payment-method-type'
import RegisteredPaymentMethod from './registered'

type RegisteredMethodSectionProps = {
  methods: PaymentMethodModel[]
  selected: SelectedMethod
  disabled: boolean
  onSelectCard: (cardId: string | null) => void
  isLoading?: boolean
}

const RegisteredMethodSection = ({
  methods,
  selected,
  disabled,
  onSelectCard,
  isLoading
}: RegisteredMethodSectionProps) => (
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
      methods={methods}
      selectedCard={selected?.type === 'card' ? selected.id : null}
      onCardSelect={onSelectCard}
      disabled={disabled}
      isLoading={isLoading}
    />
  </div>
)

export default RegisteredMethodSection
