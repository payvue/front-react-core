'use client'

import type { SmartStoreCommunityProfile, SmartStoreMember } from '@/features/smartstore/types'

export class SmartStoreCommunityProfileRecord implements SmartStoreCommunityProfile {
  readonly storeId: string
  readonly communityName?: string
  readonly communitySummary?: string
  readonly members: SmartStoreMember[]

  constructor(payload: SmartStoreCommunityProfile) {
    this.storeId = payload.storeId
    this.communityName = payload.communityName
    this.communitySummary = payload.communitySummary
    this.members = payload.members ?? []
  }

  toPlain(): SmartStoreCommunityProfile {
    return {
      storeId: this.storeId,
      communityName: this.communityName,
      communitySummary: this.communitySummary,
      members: this.members,
    }
  }
}
