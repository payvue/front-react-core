'use client'

import { useQuery } from '@tanstack/react-query'
import type { Method } from 'axios'
import request from '@/lib/api/client'
import APIResponse from '@/lib/api/types/response'
import { REQUEST_URL } from '@/constants'

export interface CommunityInfo {
  id: string
  name: string
  description?: string
  memberCount?: number
  profileImage?: string
}

interface CommunityParticipatingResponse {
  hasIssue: boolean
  groups: Array<{
    id: string
    name: string
    description?: string
    members?: Array<any>
    profileImage?: string
  }>
}

const fetchMyGroups = async (): Promise<CommunityInfo[]> => {
  const response = (await request({
    method: 'GET' as Method,
    url: REQUEST_URL.PRIVATE.COMMUNITYINFO,
  })) as APIResponse<CommunityParticipatingResponse>

  const groups = response.data?.groups ?? []
  return groups.map((group) => ({
    id: group.id,
    name: group.name,
    description: group.description,
    memberCount: group.members?.length ?? 0,
    profileImage: group.profileImage,
  }))
}

export const useMyGroupsQuery = () => {
  return useQuery<CommunityInfo[]>({
    queryKey: ['community', 'my-groups'],
    queryFn: fetchMyGroups,
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 30, // 30분
  })
}
