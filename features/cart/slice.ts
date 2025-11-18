import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { CartItem } from '@/features/cart/types'

export interface CartState {
  items: CartItem[]
}

const initialState: CartState = {
  items: [],
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const item = action.payload
      const existing = state.items.find((cartItem) => cartItem.id === item.id)
      if (existing) {
        existing.quantity += item.quantity
      } else {
        state.items.push(item)
      }
    },
    updateQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const target = state.items.find((item) => item.id === action.payload.id)
      if (target) {
        target.quantity = action.payload.quantity
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    clearCart(state) {
      state.items = []
    },
  },
})

export const { addItem, updateQuantity, removeItem, clearCart } = cartSlice.actions
export default cartSlice.reducer
