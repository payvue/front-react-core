import { ApiResponse } from '@/lib/api/types'
import { Community } from '@/types'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { responseCode } from '@/features/apis'
import { normalizeCommunityRole } from './utils/role'

const normalizeParticipatingContext = (context?: Community.Context) => {
  if (!context) {
    return context
  }

  return {
    ...context,
    groups: (context.groups ?? []).map((group) => ({
      ...group,
      members: (group.members ?? []).map((member) => ({
        ...member,
        role: normalizeCommunityRole(member.role),
      })),
    })),
  }
}

export const fetchParticipatingGroups = createAsyncThunk(
  'community/fetchParticipatingGroups',
  async (res: ApiResponse<Community.Context>) => {
    if (res.code === responseCode.SUCCESS) {
      return normalizeParticipatingContext(res.data)
    }
    throw new Error('Failed to fetch user info')
  },
)
