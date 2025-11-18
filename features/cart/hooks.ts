import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch } from '@/lib/store/store'
import { addItem, clearCart, removeItem, updateQuantity } from './slice'
import { selectCartCount, selectCartItems, selectCartTotal } from './selectors'
import { CartEntry, type CartEntrySource } from './models/cart-entry'

export const useCart = () => {
  const dispatch = useDispatch<AppDispatch>()
  const items = useSelector(selectCartItems)
  const total = useSelector(selectCartTotal)
  const count = useSelector(selectCartCount)

  return {
    items,
    total,
    count,
    addItem: (item: CartEntrySource) => dispatch(addItem(new CartEntry(item).toPlainObject())),
    updateQuantity: (id: string, quantity: number) => dispatch(updateQuantity({ id, quantity })),
    removeItem: (id: string) => dispatch(removeItem(id)),
    clearCart: () => dispatch(clearCart()),
  }
}
