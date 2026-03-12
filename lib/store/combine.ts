

import authReducer from '@/features/auth/slice'
import communityReducer from '@/features/community/slice'
import payReducer from '@/features/pay/payment/store/slice'
import smartStoreReducer from '@/features/smartstore/state/smartstore-slice'
import cartReducer from '@/features/cart/slice'
import assetReducer from '@/features/asset/store/slice'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  auth: authReducer,
  community: communityReducer,
  pay: payReducer,
  smartStore: smartStoreReducer,
  cart: cartReducer,
  asset: assetReducer,
})

export default rootReducer
