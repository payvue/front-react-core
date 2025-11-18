import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/lib/store/store'

const selectState = (state: RootState) => state.smartStore

export const selectStoresMap = createSelector(selectState, (state) => state.stores)

export const selectStores = createSelector(selectStoresMap, (storesMap) =>
  Object.values(storesMap),
)

export const selectSubscribedStores = createSelector(selectStores, (stores) =>
  stores.filter((store) => store.isSubscribed),
)

export const selectSubscribedProducts = createSelector(selectSubscribedStores, (stores) =>
  stores.flatMap((store) =>
    store.products.map((product) => ({
      ...product,
      mall: store.id,
      mallName: store.name,
      mallLogo: store.id.slice(0, 2).toUpperCase(),
    })),
  ),
)

export const selectStats = createSelector(selectStores, (stores) => {
  const subscribedStores = stores.filter((store) => store.isSubscribed)
  const totalProducts = stores.reduce((acc, store) => acc + store.products.length, 0)
  const subscribedProductCount = subscribedStores.reduce(
    (acc, store) => acc + store.products.length,
    0,
  )

  return {
    stores: stores.length,
    subscribedStores: subscribedStores.length,
    totalProducts,
    subscribedProductCount,
  }
})

export const selectStoreCommunityProfiles = createSelector(
  selectState,
  (state) => state.communityProfiles,
)

export const selectStoreInventoryMap = createSelector(
  selectState,
  (state) => state.inventoryByStore,
)

export const selectInfoStatus = createSelector(selectState, (state) => state.status.info)
export const selectMembersStatus = createSelector(selectState, (state) => state.status.members)
export const selectInventoryStatus = createSelector(
  selectState,
  (state) => state.status.inventory,
)
