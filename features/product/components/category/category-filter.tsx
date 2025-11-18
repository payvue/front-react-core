'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ProductCategory, ProductCategoryOption } from '@/features/product/types'

export type CategoryFilterValue = ProductCategoryOption['value'] | 'all'

interface CategoryFilterProps {
  label?: string
  options: ProductCategory[]
  defaultValue?: CategoryFilterValue
  value?: CategoryFilterValue
  onChange?: (value: CategoryFilterValue) => void
  className?: string
}

export function CategoryFilter({
  label = '카테고리',
  options,
  defaultValue = 'all',
  value,
  onChange,
  className,
}: CategoryFilterProps) {
  const [internalValue, setInternalValue] = useState<CategoryFilterValue>(defaultValue)
  const currentValue = value ?? internalValue

  const handleChange = (nextValue: string) => {
    const resolvedValue = (nextValue as CategoryFilterValue) || 'all'
    setInternalValue(resolvedValue)
    onChange?.(resolvedValue)
  }

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className ?? ''}`}>
      <Label className="text-sm text-muted-foreground">{label}</Label>
      <Select value={currentValue} onValueChange={handleChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="카테고리" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
