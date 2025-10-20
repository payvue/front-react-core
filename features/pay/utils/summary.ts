import type { Product } from '@/types'

const EMPTY_PRODUCT: Product = {
  name: '',
  type: '',
  price: 0,
  amount: 0
}

export const buildSummaryProduct = (payload: Product | Product[]): Product => {
  if (Array.isArray(payload)) {
    if (payload.length === 0) {
      return EMPTY_PRODUCT
    }

    const primary = payload[0]
    const totalAmount = payload.reduce((sum, current) => sum + current.price * current.amount, 0)

    return {
      name: payload.length > 1 ? `${primary.name} 외 ${payload.length - 1}건` : primary.name,
      type: '다건 결제',
      price: totalAmount,
      amount: 1
    }
  }

  return payload
}

export const isBulkPayload = (payload: Product | Product[]): payload is Product[] => Array.isArray(payload)

export const EMPTY_SUMMARY = EMPTY_PRODUCT
