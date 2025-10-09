
import authReducer from '@/features/auth/slice'
import communityReducer from '@/features/community/slice'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  auth: authReducer,
  community: communityReducer
})

export default rootReducer