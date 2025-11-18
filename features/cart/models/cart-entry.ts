import type { CartItem } from '@/features/cart/types'
import type { SubscribedProduct } from '@/features/product/types'

export type CartEntrySource = CartItem | SubscribedProduct

const isCartItem = (source: CartEntrySource): source is CartItem => {
  return 'quantity' in source && !('authorId' in source)
}

export class CartEntry {
  private readonly value: CartItem

  constructor(source: CartEntrySource) {
    if (isCartItem(source)) {
      this.value = { ...source }
      return
    }

    this.value = {
      id: `${source.mall}-${source.id}`,
      name: source.name,
      price: source.price,
      originalPrice: source.originalPrice,
      rating: source.rating,
      reviewCount: source.reviewCount,
      image: source.image,
      mall: source.mall,
      mallName: source.mallName,
      category: source.category,
      quantity: 1,
    }
  }

  toPlainObject(): CartItem {
    return { ...this.value }
  }
}
