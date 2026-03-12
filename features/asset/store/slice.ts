import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { OnlineAssetCategory, OnlineAssetStatus } from '@/features/asset/summary/types/online-asset'

export interface AssetInventoryItem {
  id: string
  name: string
  category: OnlineAssetCategory
  amount: number
  purchaseDate: string
  status: OnlineAssetStatus
  balance?: number
  description?: string
}

interface AssetState {
  items: AssetInventoryItem[]
}

const initialState: AssetState = {
  items: [],
}

const assetSlice = createSlice({
  name: 'asset',
  initialState,
  reducers: {
    setAssetItems: (state, action: PayloadAction<AssetInventoryItem[]>) => {
      state.items = action.payload
    },
    clearAssetItems: (state) => {
      state.items = []
    },
  },
})

export const { setAssetItems, clearAssetItems } = assetSlice.actions
export default assetSlice.reducer
