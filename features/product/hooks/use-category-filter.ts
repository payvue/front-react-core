import { useMemo } from 'react'
import type { CategoryFilterValue } from '../components/category/category-filter'
import { PRODUCT_CATEGORY_OPTIONS, type ProductCategoryOption } from '../types'

export const useCategoryFilter = <T extends { category: string }>(
  products: T[],
  value: CategoryFilterValue,
) => {
  const options = useMemo(() => {
    const optionMap = new Map<string, ProductCategoryOption>()
    PRODUCT_CATEGORY_OPTIONS.forEach((option) => optionMap.set(option.value, option))
    products.forEach((product) => {
      if (!optionMap.has(product.category)) {
        optionMap.set(product.category, {
          value: product.category,
          label: product.category,
        })
      }
    })
    return Array.from(optionMap.values())
  }, [products])

  const filtered = useMemo(() => {
    if (value === 'all') return products
    return products.filter((product) => product.category === value)
  }, [products, value])

  return { options, filtered }
}
