'use client'

import type { ReactNode } from 'react'
import { CategoryFilter, type CategoryFilterValue } from './category-filter'
import { type ProductCategoryOption } from '@/features/product/types'
import { useCategoryFilter } from '../../hooks/use-category-filter'

interface CategoryFilterControllerProps<T extends { category: string }> {
  products: T[]
  value: CategoryFilterValue
  onChange: (value: CategoryFilterValue) => void
  filterComponent?: React.ComponentType<{ option?: ProductCategoryOption }>
  children: (args: {
    options: ProductCategoryOption[]
    filtered: T[]
    Filter: ReactNode
  }) => ReactNode
}

export function CategoryFilterController<T extends { category: string }>({
  products,
  value,
  onChange,
  FilterComponent = CategoryFilter,
  children,
}: CategoryFilterControllerProps<T>) {
  const { options, filtered } = useCategoryFilter(products, value)
  const Filter = <FilterComponent options={options} value={value} onChange={onChange} />

  return <>{children({ options, filtered, Filter })}</>
}
