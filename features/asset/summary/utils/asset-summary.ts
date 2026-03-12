import type { AssetSummaryResponse, AssetSummaryView } from "../types/asset-summary"

const emptyBreakdown = {
  game: 0,
  music: 0,
  gift: 0,
  shopping: 0,
}

export const mapAssetSummaryResponse = (response?: AssetSummaryResponse): AssetSummaryView => {
  if (!response) {
    return {
      totalValue: 0,
      personalAssets: 0,
      sharedAssets: 0,
      monthlyChange: 0,
      categoryBreakdown: { ...emptyBreakdown },
    }
  }

  const breakdown = { ...emptyBreakdown }
  response.categories?.forEach((category) => {
    const normalizedCategory = category.category?.toLowerCase()
    if (!normalizedCategory) {
      return
    }

    if (normalizedCategory in breakdown) {
      breakdown[normalizedCategory as keyof typeof breakdown] = category.amount
    }
  })

  return {
    totalValue: response.totalValue,
    personalAssets: response.personalValue,
    sharedAssets: response.sharedValue,
    monthlyChange: response.monthlyChange,
    categoryBreakdown: breakdown,
  }
}
