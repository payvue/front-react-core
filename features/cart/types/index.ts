export interface CartItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  rating?: number
  reviewCount?: number
  image?: string
  mall: string
  mallName?: string
  category: string
  discount?: number
  quantity: number
}
