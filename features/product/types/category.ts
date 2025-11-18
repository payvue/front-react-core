export const PRODUCT_CATEGORY_OPTIONS = [
  { value: 'electronics', label: '전자기기' },
  { value: 'shoes', label: '신발' },
  { value: 'beauty', label: '뷰티' },
  { value: 'fashion', label: '의류' },
  { value: 'food', label: '식품' },
  { value: 'sports', label: '스포츠' },
  { value: 'living', label: '생활용품' },
  { value: 'appliance', label: '가전' },
] as const

export type ProductCategoryOption = (typeof PRODUCT_CATEGORY_OPTIONS)[number]
export type ProductCategory = ProductCategoryOption['value']
