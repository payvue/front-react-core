import type APIResponse from '@/lib/api/types/response'
import type { Product, Provider } from '@/types'
import type { Pay } from '@/features/pay/types/pay'
import type { PayCore } from '../core'

export interface PaymentInitiateData {
  reserve?: string
  paymentId?: string
  redirectUrl?: string | null
  virtualAccount?: {
    bankCode?: string
    accountNumber?: string
    customerName?: string
    dueDate?: string
    amount?: number
  }
  confirm?: {
    payId?: string
    paymentId?: string
    reserveId?: string | null
    resultCode?: string | null
  }
  [key: string]: unknown
}

export interface PaymentStrategy {
  type: PaymentStrategyType
  initiate: (transaction: Pay.Common) => Promise<APIResponse<PaymentInitiateData>>
  apply: (params: { provider: Provider; paymentId: string }) => Promise<APIResponse>
  cancel: (params: {
    product?: Product | Product[]
    provider: Provider
    paymentId: string
  }) => Promise<void>
  handleReserve?: (core: PayCore, payload: PaymentInitiateData) => void
  closeMessage?: string
}

export type PaymentStrategyType = 'single' | 'multiple' | 'recurrent' | 'virtual_account'
