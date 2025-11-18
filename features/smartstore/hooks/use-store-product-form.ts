'use client'

import { useEffect, useMemo, useState } from 'react'
import { DEFAULT_PRODUCT_IMAGE } from '@/features/product/types'
import type { ProductCategoryOption } from '@/features/product/types'
import type {
  SmartStoreMember,
  SmartStoreProductFormState,
  StoreProductDraft,
} from '@/features/smartstore/types'
import { StoreInventoryProductItem } from '@/features/product/models/store-inventory-product-item'

interface UseStoreProductFormOptions {
  communityMembers: SmartStoreMember[]
  categoryOptions: ProductCategoryOption[]
}

const buildInitialState = (
  categoryOptions: ProductCategoryOption[],
  communityMembers: SmartStoreMember[],
): SmartStoreProductFormState => ({
  name: '',
  description: '',
  price: '',
  quantity: '',
  category: categoryOptions[0]?.value ?? '',
  authorId: communityMembers[0]?.id ?? '',
  image: DEFAULT_PRODUCT_IMAGE,
})

export const useStoreProductForm = ({
  communityMembers,
  categoryOptions,
}: UseStoreProductFormOptions) => {
  const [formState, setFormState] = useState<SmartStoreProductFormState>(
    buildInitialState(categoryOptions, communityMembers),
  )

  useEffect(() => {
    setFormState(buildInitialState(categoryOptions, communityMembers))
  }, [categoryOptions, communityMembers])

  const handleChange = (field: keyof SmartStoreProductFormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  const isValid = useMemo(() => {
    return Boolean(
      formState.name.trim() &&
        formState.description.trim() &&
        Number(formState.price) > 0 &&
        Number(formState.quantity) > 0 &&
        (formState.authorId || communityMembers[0]?.id) &&
        formState.image,
    )
  }, [formState, communityMembers])

  const handleSubmit = (): StoreProductDraft | null => {
    if (!isValid) return null
    const item = new StoreInventoryProductItem(formState, {
      fallbackAuthorId: communityMembers[0]?.id ?? '',
      fallbackImage: DEFAULT_PRODUCT_IMAGE,
    })
    setFormState(buildInitialState(categoryOptions, communityMembers))
    return item.toPlain()
  }

  return {
    isValid,
    formState,
    handleChange,
    handleSubmit,
  }
}
