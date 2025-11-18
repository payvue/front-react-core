'use client'

import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type {
  SmartStoreCommunityProfile,
  SmartStoreInfo,
  SmartStoreInventory,
} from '@/features/smartstore/types'
import type { StoreInventoryProduct } from '@/features/product/types'

type RequestStatus = 'idle' | 'loading' | 'success' | 'error'

interface SmartStoreState {
  stores: Record<string, SmartStoreInfo>
  communityProfiles: Record<string, SmartStoreCommunityProfile | undefined>
  inventoryByStore: Record<string, StoreInventoryProduct[] | undefined>
  status: {
    info: RequestStatus
    members: Record<string, RequestStatus>
    inventory: Record<string, RequestStatus>
  }
}

const initialState: SmartStoreState = {
  stores: {},
  communityProfiles: {},
  inventoryByStore: {},
  status: {
    info: 'idle',
    members: {},
    inventory: {},
  },
}

const applyProducts = (store: SmartStoreInfo, products?: StoreInventoryProduct[]) => ({
  ...store,
  products: products ?? store.products ?? [],
})

const smartStoreSlice = createSlice({
  name: 'smartStore',
  initialState,
  reducers: {
    setStoreList(state, action: PayloadAction<SmartStoreInfo[]>) {
      state.stores = action.payload.reduce<Record<string, SmartStoreInfo>>((acc, store) => {
        acc[store.id] = applyProducts(store)
        return acc
      }, {})
    },
    setStoreCommunityProfile(state, action: PayloadAction<SmartStoreCommunityProfile>) {
      const profile = action.payload
      state.communityProfiles[profile.storeId] = profile
    },
    setStoreInventory(state, action: PayloadAction<SmartStoreInventory>) {
      const { storeId, products } = action.payload
      state.inventoryByStore[storeId] = products
      const existing = state.stores[storeId]
      if (existing) {
        state.stores[storeId] = applyProducts(existing, products)
      }
    },
    updateInfoStatus(state, action: PayloadAction<RequestStatus>) {
      state.status.info = action.payload
    },
    updateMembersStatus(
      state,
      action: PayloadAction<{ storeId: string; status: RequestStatus }>,
    ) {
      state.status.members[action.payload.storeId] = action.payload.status
    },
    updateInventoryStatus(
      state,
      action: PayloadAction<{ storeId: string; status: RequestStatus }>,
    ) {
      state.status.inventory[action.payload.storeId] = action.payload.status
    },
    toggleSubscription(state, action: PayloadAction<string>) {
      const store = state.stores[action.payload]
      if (store) {
        state.stores[action.payload] = { ...store, isSubscribed: !store.isSubscribed }
      }
    },
    addStore(state, action: PayloadAction<SmartStoreInfo>) {
      const store = action.payload
      state.stores[store.id] = applyProducts(store)
    },
    addProduct(state, action: PayloadAction<{ storeId: string; product: StoreInventoryProduct }>) {
      const { storeId, product } = action.payload
      const current = state.inventoryByStore[storeId] ?? []
      const nextProducts = [...current, product]
      state.inventoryByStore[storeId] = nextProducts
      if (state.stores[storeId]) {
        state.stores[storeId] = applyProducts(state.stores[storeId], nextProducts)
      }
    },
    removeProduct(state, action: PayloadAction<{ storeId: string; productId: string }>) {
      const { storeId, productId } = action.payload
      const current = state.inventoryByStore[storeId] ?? []
      const filtered = current.filter((product) => product.id !== productId)
      state.inventoryByStore[storeId] = filtered
      if (state.stores[storeId]) {
        state.stores[storeId] = applyProducts(state.stores[storeId], filtered)
      }
    },
  },
})

export const {
  setStoreList,
  setStoreCommunityProfile,
  setStoreInventory,
  updateInfoStatus,
  updateMembersStatus,
  updateInventoryStatus,
  toggleSubscription,
  addStore,
  addProduct,
  removeProduct,
} = smartStoreSlice.actions
export default smartStoreSlice.reducer
