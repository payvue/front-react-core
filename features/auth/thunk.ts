
import { ApiResponse } from '@/lib/api/types';
import { User } from '@/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { responseCode } from '@/features/apis';


export const fetchUserInfo = createAsyncThunk(
  'auth/fetchUserInfo',
  async (res: ApiResponse<User.Context>) => {
    if(res.code == responseCode.SUCCESS) return res.data
    throw new Error('Failed to fetch user info');
  }
);