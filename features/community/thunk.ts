
import { ApiResponse } from '@/lib/api/types';
import { Community } from '@/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { responseCode } from '@/features/apis';


export const fetchParticipatingGroups = createAsyncThunk(
    'community/fetchParticipatingGroups',
    async (res: ApiResponse<Community.Context>) => {
        console.log('Response code:', res.code);
        console.log('Expected code:', responseCode.SUCCESS);        
        if(res.code == responseCode.SUCCESS) return res.data
        throw new Error('Failed to fetch user info');
    }
)