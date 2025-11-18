'use client'

import type { SmartStoreProductFormState, StoreProductDraft } from '@/features/smartstore/types'

interface StoreInventoryProductItemOptions {
  fallbackAuthorId: string
  fallbackImage: string
}

export class StoreInventoryProductItem {
  readonly formState: SmartStoreProductFormState
  readonly fallback: StoreInventoryProductItemOptions

  constructor(formState: SmartStoreProductFormState, fallback: StoreInventoryProductItemOptions) {
    this.formState = formState
    this.fallback = fallback
  }

  toPlain(): StoreProductDraft {
    const { name, description, price, quantity, category, authorId, image } = this.formState
    const { fallbackAuthorId, fallbackImage } = this.fallback

    return {
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      quantity: Number(quantity),
      category,
      authorId: authorId || fallbackAuthorId,
      image: image || fallbackImage,
    }
  }
}
