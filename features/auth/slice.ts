import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchUserInfo } from '@/features/auth';
import { DomainState, User } from "@/types";
import { setLocalStorageItem } from "@/util/localStorage";
import { LOCAL_STORAGE_KEY } from "@/constants";

const initial :DomainState<User.Context> = {
    domain: {
      account: {
        alias: "guest",
        id: "",
        token: "",
        status: {
          isLoggedIn: false,
          lastLoggedIn: "",
          joinAt: ""
        },
      },    
      info: {
        name: "",
        resident: "",
        address: {
          city: "",
          district: "",
          street: "",
          postCode: "",
          detailed: "",
        },
        contact: {
          email: "",
          phone: "",
        },
        birth: "",
        provider: "",
        avatar: "",
      },
      asset: {
        balance: 0,
        point: 0,
      }
    },
    loading: false,
    error: null    
}

const authSlice = createSlice({
  name: 'auth',
  initialState: initial,
  reducers: {
    authenticated: (state, action: PayloadAction<string>) => {
      state.domain.account.token = action.payload
      state.domain.account.status.isLoggedIn = true
      setLocalStorageItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, state.domain.account.token)
    },
    unauthenticated: (state) => initial,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInfo.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        const data = action.payload
        if (data) {
          state.domain.account.alias = data.account.alias
          state.domain.account.id = data.account.id
          state.domain.info = data.info
          state.domain.account.status.lastLoggedIn = data.account.status.lastLoggedIn
          state.domain.account.status.joinAt = data.account.status.joinAt
          state.domain.asset = data.asset
        }

        state.loading = false
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch user info"
      })
  }
});

export const { 
  authenticated,  
  unauthenticated,
} = authSlice.actions;

export default authSlice.reducer;