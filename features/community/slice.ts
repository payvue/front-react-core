
import { Community, DomainState } from '@/types';
import { createSlice } from '@reduxjs/toolkit';
import { fetchParticipatingGroups } from './thunk';
import { cloneDeep } from 'lodash';


const initial: DomainState<Community.Context> = {
    domain: {
        id: "" as string,
        hasIssue: true,
        groups: Array.from([])
    },
    loading: false,
    error: null      
}

const CommunitySlice = createSlice({
    name: 'community',
    initialState: initial,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchParticipatingGroups.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(fetchParticipatingGroups.fulfilled, (state, action) => {
            const data = action.payload

            const groupMap = new Map(state.domain.groups.map(g => [g.id, cloneDeep(g)]))
            data?.groups.forEach(group => groupMap.set(group.id, group))

            state.domain.groups = Array.from(groupMap.values())
            state.domain.hasIssue = false
            state.loading = false
        })
    }

})

export const {

} = CommunitySlice.actions
export default CommunitySlice.reducer