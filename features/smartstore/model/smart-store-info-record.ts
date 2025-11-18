'use client'

import type { SmartStoreInfo } from '@/features/smartstore/types'

export class SmartStoreInfoRecord implements SmartStoreInfo {
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

  constructor(payload: SmartStoreInfo) {
    this.id = payload.id
    this.name = payload.name
    this.description = payload.description
    this.rating = payload.rating
    this.subscribers = payload.subscribers
    this.monthlyVolume = payload.monthlyVolume
    this.communityId = payload.communityId
    this.managerId = payload.managerId
    this.isSubscribed = payload.isSubscribed
    this.summary = payload.summary
    this.products = payload.products ?? []
  }

  toPlain(): SmartStoreInfo {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      rating: this.rating,
      subscribers: this.subscribers,
      monthlyVolume: this.monthlyVolume,
      communityId: this.communityId,
      managerId: this.managerId,
      isSubscribed: this.isSubscribed,
      summary: this.summary,
      products: this.products,
    }
  }
}
