export type PaymentMethodType = 'card' | 'bank' | 'mobile'

export interface PaymentMethodSchema {
  id: string
  type: PaymentMethodType
  name: string
  details: string
  isDefault: boolean
  isActive: boolean
}
