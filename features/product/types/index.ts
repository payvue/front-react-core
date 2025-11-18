export interface StoreProduct {
  id: string
  name: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  image: string
  category: string
  description: string
  createdAt: string
}

export interface SubscribedProduct extends StoreProduct {
  mall: string
  mallName: string
  mallLogo?: string
}

export interface StoreInventoryProduct {
  id: string
  name: string
  description: string
  quantity: number
  price: number
  category: string
  authorId: string
  image: string
}

export interface ProductImageOption {
  value: string
  label: string
}

export const PRODUCT_IMAGE_OPTIONS: ProductImageOption[] = [
  { value: '/images/store-generic-product.svg', label: '기본 이미지' },
  { value: '/images/store-smart-watch.svg', label: '스마트 워치' },
  { value: '/images/store-ai-speaker.svg', label: 'AI 스피커' },
  { value: '/images/store-running-shoes.svg', label: '러닝화' },
  { value: '/images/store-morning-package.svg', label: '모닝 패키지' },
]

export const DEFAULT_PRODUCT_IMAGE = PRODUCT_IMAGE_OPTIONS[0].value

export * from './category'
