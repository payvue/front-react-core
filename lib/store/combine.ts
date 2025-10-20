

import authReducer from '@/features/auth/slice'
import communityReducer from '@/features/community/slice'
import payReducer from '@/features/pay/payment/store/slice'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  auth: authReducer,
  community: communityReducer,
  pay: payReducer
})

export default rootReducer
