'use client'

import { useDispatch } from 'react-redux'
import type { AppDispatch } from '@/lib/store/store'
import { addProduct, removeProduct } from '@/features/smartstore/state/smartstore-slice'
import type { StoreInventoryProduct } from '@/features/product/types'

export const useOnlineSmartStoreInventory = () => {
  const dispatch = useDispatch<AppDispatch>()

  return {
    addProduct: (storeId: string, product: StoreInventoryProduct) =>
      dispatch(addProduct({ storeId, product })),
    removeProduct: (storeId: string, productId: string) =>
      dispatch(removeProduct({ storeId, productId })),
  }
}
