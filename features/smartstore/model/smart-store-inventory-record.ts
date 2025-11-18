'use client'

import type { SmartStoreInventory } from '@/features/smartstore/types'

export class SmartStoreInventoryRecord implements SmartStoreInventory {
  readonly storeId: string
  readonly products: SmartStoreInventory['products']

  constructor(payload: SmartStoreInventory) {
    this.storeId = payload.storeId
    this.products = payload.products ?? []
  }

  toPlain(): SmartStoreInventory {
    return {
      storeId: this.storeId,
      products: this.products,
    }
  }
}
