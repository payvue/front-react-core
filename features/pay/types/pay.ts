import { type Product } from '@/types'
import type { Pay as PayRule } from '@/features/pay/types/rule'

export declare namespace Pay {
  export type Mode = 'single' | 'recurrent' | 'multiple' | 'virtual_account'
  export type BankCode = '088' | '004' | '020' | '011' | '081'

  export interface VirtualAccountDetails {
    id: string
    channel: 'virtual_account'
    bankCode: BankCode
  }

  export interface Context {
    transactions: Common
    status: PayStatus
    rule?: PayRule.RuleBase
  }

  interface PayStatus {
    processing: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
    processedAt: string
    failureReason?: string
  }

  interface Common {
    item: Product | Product[]
    method: Method
    mode?: Mode
  }

  interface Method {
    type: 'card' | 'bank' | 'mobile' | 'cash' | 'easypay' | 'registered'
    details: any
    isDefault?: boolean
  }
}
