import { type Product } from "@/types"
import type { Pay as PayRule } from "@/features/pay/types/rule"

export declare namespace Pay {
  export type Mode = "single" | "recurrent" | "multiple"

  export interface Context {
    transactions: Common
    status: PayStatus
    rule?: PayRule.RuleBase
  }

  interface PayStatus {
    processing: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED"
    processedAt: string
    failureReason?: string
  }

  interface Common {
    item: Product | Product[]
    method: Method
    mode?: Mode
  }

  interface Method {
    type: "card" | "bank" | "mobile" | "cash" | "easypay" | "registered"
    details: any
    isDefault?: boolean
  }
}
