
import reducer from '@/features/auth/slice';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  auth: reducer,
});

export default rootReducer