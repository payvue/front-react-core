'use client'

import { useMemo, useState } from 'react'
import { StoreProductForm } from '@/features/smartstore/components/store-product-form'
import { PRODUCT_CATEGORY_OPTIONS } from '@/features/product/types'
import { CategoryFilterController } from '@/features/product/components/category/category-filter-controller'
import type { CategoryFilterValue } from '@/features/product/components/category/category-filter'
import { useSmartStorePageContext } from '@/features/smartstore/context'
import { StoreInventoryGrid } from '@/features/smartstore/components/inventory/store-inventory-grid'
import { useOnlineSmartStoreInventory } from '@/features/smartstore/hooks/use-smartstore-inventory'
import type { StoreProductDraft } from '@/features/smartstore/types'
import { useSmartStoreInventoryQuery } from '@/features/smartstore/hooks/queries'

interface StoreProductsTabProps {
  activeTab: string
}

export function StoreProductsTab({ activeTab }: StoreProductsTabProps) {
  const [category, setCategory] = useState<CategoryFilterValue>('all')
  const { selectedStore, communityMembers, selectedStoreId } = useSmartStorePageContext()
  const { addProduct, removeProduct } = useOnlineSmartStoreInventory()

  useSmartStoreInventoryQuery(selectedStoreId, {
    enabled: Boolean(selectedStoreId) && activeTab === 'products',
  })

  const products = useMemo(() => selectedStore?.products ?? [], [selectedStore])

  const handleCreateProduct = (draft: StoreProductDraft) => {
    if (!selectedStore) return
    addProduct(selectedStore.id, { id: `product-${Date.now()}`, ...draft })
  }

  const handleDeleteProduct = (productId: string) => {
    if (!selectedStore) return
    removeProduct(selectedStore.id, productId)
  }

  return (
    <CategoryFilterController products={products} value={category} onChange={setCategory}>
      {({ filtered, Filter }) => (
        <>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {Filter}
            <StoreProductForm
              communityMembers={communityMembers}
              categoryOptions={PRODUCT_CATEGORY_OPTIONS.map((categoryOption) => ({
                ...categoryOption,
              }))}
              disabled={!selectedStore}
              onSubmit={handleCreateProduct}
            />
          </div>
          <StoreInventoryGrid
            products={filtered}
            communityMembers={communityMembers}
            onDelete={handleDeleteProduct}
          />
        </>
      )}
    </CategoryFilterController>
  )
}
