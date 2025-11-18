'use client'

import type {
  SmartStoreCommunityProfile,
  SmartStoreInfo,
  SmartStoreMember,
} from '@/features/smartstore/types'

export class OnlineSmartStore implements SmartStoreInfo {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly rating: number
  readonly subscribers: number
  readonly monthlyVolume: number
  readonly communityId: string
  readonly managerId: string
  readonly isSubscribed?: boolean
  readonly summary?: string
  readonly products: SmartStoreInfo['products']
  readonly communityMembers: SmartStoreMember[]
  readonly communityName?: string
  readonly communitySummary?: string

  constructor(store: SmartStoreInfo, community?: SmartStoreCommunityProfile) {
    this.id = store.id
    this.name = store.name
    this.description = store.description
    this.rating = store.rating
    this.subscribers = store.subscribers
    this.monthlyVolume = store.monthlyVolume
    this.communityId = store.communityId
    this.managerId = store.managerId
    this.isSubscribed = store.isSubscribed
    this.summary = store.summary
    this.products = store.products
    this.communityMembers = community?.members ?? []
    this.communityName = community?.communityName
    this.communitySummary = community?.communitySummary
  }

  get manager(): SmartStoreMember | undefined {
    return this.communityMembers.find((member) => member.id === this.managerId)
  }
}
