import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/lib/store/store'

const selectCartState = (state: RootState) => state.cart

export const selectCartItems = createSelector(selectCartState, (state) => state.items)

export const selectCartCount = createSelector(selectCartItems, (items) =>
  items.reduce((total, item) => total + item.quantity, 0),
)

export const selectCartTotal = createSelector(selectCartItems, (items) =>
  items.reduce((total, item) => total + item.price * item.quantity, 0),
)
