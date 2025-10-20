import { responseCode } from "@/features/apis"
import type { Pay } from "@/features/pay/types/pay"
import APIResponse from "../api/types/response"
import type { Product, Provider } from "@/types"
import { PayError } from "./error"
import { payCore } from "./core"
import type { PaymentInitiateData, PaymentStrategy, PaymentStrategyType } from "./strategy"
import { createStrategyByType } from "./strategy"

type StrategyAlias = PaymentStrategyType | "reserve" | "bulk"
type StrategyConfig = StrategyAlias | PaymentStrategy

interface PayvueOptions {
  strategy?: StrategyConfig
}

const isPayError = (error: unknown): error is PayError => {
  if (!error || typeof error !== "object") {
    return false
  }

  return (error as PayError).name === "PayError"
}

const mapStrategyAlias = (alias: StrategyAlias): PaymentStrategyType => {
  switch (alias) {
    case "reserve":
      return "recurrent"
    case "bulk":
      return "multiple"
    default:
      return alias
  }
}

const resolveStrategy = (input?: StrategyConfig): PaymentStrategy => {
  if (!input) {
    return createStrategyByType("single")
  }

  if (typeof input === "string") {
    return createStrategyByType(mapStrategyAlias(input))
  }

  return input
}

const extractProduct = (transaction: Pay.Common): Product | Product[] => {
  return transaction.item as unknown as Product | Product[]
}

export const createPaymentClient = (options: PayvueOptions = {}) => {
  const core = payCore()
  const strategy = resolveStrategy(options.strategy)

  const payment = async (transaction: Pay.Common): Promise<void> => {
    const provider = transaction.method.details as Provider
    const product = extractProduct(transaction)

    try {
      const response = await strategy.initiate(transaction)

      if (response.code !== responseCode.SUCCESS) {
        const payload = (response.data ?? {}) as PaymentInitiateData
        const error: PayError = {
          name: "PayError",
          message: response.message,
          paymentId: payload.paymentId ?? "",
          status: "FAILED",
        }

        throw error
      }

      const payload = (response.data ?? {}) as PaymentInitiateData

      core.startProcessing()

      if (strategy.handleReserve) {
        strategy.handleReserve(core, payload)
      } else if (payload.reserve) {
        core.reserve(payload.reserve, () => {
          core.notifyPaymentClosed(strategy.closeMessage)
        })
      } else {
        core.finishProcessing()
      }

      await core.waitUntilFinished()
    } catch (error) {
      if (isPayError(error)) {
        await cancel({
          paymentId: error.paymentId,
          product,
          provider,
        })
      }

      throw error
    }
  }

  const apply = async ({
    provider,
    paymentId,
  }: {
    provider: Provider
    paymentId: string
  }): Promise<APIResponse> => {
    const response = await strategy.apply({ provider, paymentId }).finally(() => {
      if (core.isProcessing()) {
        core.finishProcessing()
      }
    })

    return {
      code: response.code,
      message: response.message,
    }
  }

  const cancel = async ({
    product,
    provider,
    paymentId,
  }: {
    product?: Product | Product[]
    provider: Provider
    paymentId: string
  }): Promise<void> => {
    if (!core.isProcessing()) {
      return
    }

    try {
      await strategy.cancel({ product, provider, paymentId })
    } finally {
      core.finishProcessing()
    }
  }

  return {
    payment,
    apply,
    cancel,
  }
}

export const payvue = (options?: PayvueOptions) => createPaymentClient(options)

export default payvue
