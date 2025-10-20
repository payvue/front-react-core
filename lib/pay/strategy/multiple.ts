import { Method } from "axios"
import request from "@/lib/api/client"
import type APIResponse from "@/lib/api/types/response"
import type { Pay } from "@/features/pay/types/pay"
import type { Provider } from "@/types"
import type { PaymentInitiateData, PaymentStrategy } from "./types"

const getProvider = (transaction: Pay.Common): Provider => {
  return transaction.method.details as Provider
}

const resolvePayload = (transaction: Pay.Common) => {
  const itemsCandidate = transaction.item as unknown
  const items = Array.isArray(itemsCandidate) ? itemsCandidate : [itemsCandidate]

  return {
    ...transaction,
    items,
  }
}

export const createMultiplePaymentStrategy = (): PaymentStrategy => {
  return {
    type: "multiple",
    initiate: async (transaction) => {
      const provider = getProvider(transaction)
      const response = (await request({
        method: "POST" as Method,
        url: `/payment/multiple/${provider.id}`,
        data: resolvePayload(transaction),
      })) as APIResponse<PaymentInitiateData>

      return response
    },
    apply: async ({ provider, paymentId }) => {
      const response = (await request({
        method: "POST" as Method,
        url: `/payment/multiple/apply/${provider.id}`,
        data: paymentId,
      })) as APIResponse

      return response
    },
    cancel: async ({ product, provider, paymentId }) => {
      await request({
        method: "POST" as Method,
        url: `/payment/multiple/cancel/${provider.id}`,
        data: {
          paymentId,
          product,
        },
      })
    },
    handleReserve: (core, payload) => {
      if (!payload.reserve) {
        core.finishProcessing()
        core.notifyPaymentClosed("PAYMENT_MULTIPLE_CLOSED")
        return
      }

      core.reserve(payload.reserve, () => {
        core.notifyPaymentClosed("PAYMENT_MULTIPLE_CLOSED")
      })
    },
    closeMessage: "PAYMENT_MULTIPLE_CLOSED",
  }
}
