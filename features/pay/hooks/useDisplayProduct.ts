import { useMemo } from "react"
import type { Product } from "@/types"
import type { Pay } from "@/features/pay/types/pay"
import { buildSummaryProduct, EMPTY_SUMMARY } from "@/features/pay/utils/summary"

const useDisplayProduct = (
  summaryProduct: Product | null,
  item: Pay.Context["transactions"]["item"],
): Product => {
  return useMemo(() => {
    if (summaryProduct && summaryProduct !== EMPTY_SUMMARY) {
      return summaryProduct
    }

    if (Array.isArray(item)) {
      if (item.length === 0) {
        return EMPTY_SUMMARY
      }

      return buildSummaryProduct(item)
    }

    if (!item) {
      return EMPTY_SUMMARY
    }

    return item
  }, [summaryProduct, item])
}

export default useDisplayProduct
