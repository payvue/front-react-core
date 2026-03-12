export * from "./types"
export { createSinglePaymentStrategy } from "./single"
export { createRecurrentPaymentStrategy } from "./recurrent"
export { createMultiplePaymentStrategy } from "./multiple"

import type { PaymentStrategy, PaymentStrategyType } from "./types"
import { createSinglePaymentStrategy as createSingleStrategy } from "./single"
import { createRecurrentPaymentStrategy as createRecurrentStrategy } from "./recurrent"
import { createMultiplePaymentStrategy as createMultipleStrategy } from "./multiple"

export const createStrategyByType = (type: PaymentStrategyType): PaymentStrategy => {
  switch (type) {
    case "virtual_account":
      return createSingleStrategy()
    case "recurrent":
      return createRecurrentStrategy()
    case "multiple":
      return createMultipleStrategy()
    case "single":
    default:
      return createSingleStrategy()
  }
}
