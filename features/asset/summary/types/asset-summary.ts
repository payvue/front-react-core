export interface AssetSummaryResponse {
  total: number
  totalValue: number
  totalAssetValue: number
  personal: number
  personalValue: number
  personalAssetValue: number
  shared: number
  sharedValue: number
  sharedAssetValue: number
  monthlyChangeRate: number
  changeRate: number
  monthlyChange: number
  currency: string
  categories: AssetSummaryCategory[]
}

export interface AssetSummaryCategory {
  category: string
  amount: number
  ratio: number
}

export interface AssetSummaryView {
  totalValue: number
  personalAssets: number
  sharedAssets: number
  monthlyChange: number
  categoryBreakdown: {
    game: number
    music: number
    gift: number
    shopping: number
  }
}
