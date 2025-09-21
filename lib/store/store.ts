import { configureStore } from "@reduxjs/toolkit"
import { authReducer } from "@/features/auth"
// import shoppingReducer from "./slices/shoppingSlice"
// import paymentReducer from "./slices/paymentSlice"
// import groupsReducer from "./slices/groupsSlice"
// import uiReducer from "./slices/uiSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // shopping: shoppingReducer,
    // payment: paymentReducer,
    // groups: groupsReducer,
    // ui: uiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
