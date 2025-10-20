import type { Product } from '@/types'
import { Pay } from '@/features/pay/types/pay'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface PurchasePayload {
  item: Product | Product[]
  mode?: Pay.Mode
}

const initialState: Pay.Context = {
  transactions: {
    item: {} as Product,
    method: {} as Pay.Method,
    mode: 'single'
  },
  status: {
    processing: 'PENDING',
    processedAt: ''
  }
}

const paymentSlice = createSlice({
  name: 'pay',
  initialState,
  reducers: {
    purchase: (state, action: PayloadAction<PurchasePayload>) => {
      state.transactions.item = action.payload.item
      state.transactions.mode = action.payload.mode ?? 'single'
    },
    select: (state, action: PayloadAction<Pay.Method>) => {
      state.transactions.method = action.payload
    },
    done: () => initialState
  }
})

export const {
  purchase,
  select,
  done
} = paymentSlice.actions

export default paymentSlice.reducer
