import { Method } from "axios"
import request from "@/lib/api/client"
import type APIResponse from "@/lib/api/types/response"
import type { Pay } from "@/features/pay/types/pay"
import type { Provider } from "@/types"
import type { PaymentInitiateData, PaymentStrategy } from "./types"

const getProvider = (transaction: Pay.Common): Provider => {
  return transaction.method.details as Provider
}

export const createSinglePaymentStrategy = (): PaymentStrategy => {
  return {
    type: "single",
    initiate: async (transaction) => {
      const provider = getProvider(transaction)
      const response = (await request({
        method: "POST" as Method,
        url: `/payment/${provider.id}`,
        data: transaction.item,
      })) as APIResponse<PaymentInitiateData>

      return response
    },
    apply: async ({ provider, paymentId }) => {
      const response = (await request({
        method: "POST" as Method,
        url: `/payment/apply/${provider.id}`,
        data: paymentId,
      })) as APIResponse

      return response
    },
    cancel: async ({ product, provider, paymentId }) => {
      await request({
        method: "POST" as Method,
        url: `/patment/cancel/${provider.id}`,
        data: {
          paymentId,
          product,
        },
      })
    },
    handleReserve: (core, payload) => {
      if (!payload.reserve) {
        core.finishProcessing()
        core.notifyPaymentClosed("PAYMENT_CLOSED")
        return
      }

      core.reserve(payload.reserve, () => {
        core.notifyPaymentClosed("PAYMENT_CLOSED")
      })
    },
    closeMessage: "PAYMENT_CLOSED",
  }
}
