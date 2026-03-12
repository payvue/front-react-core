"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, DollarSign, Package, Gift } from "lucide-react"
import { useOnlineAssetsQuery } from "@/features/asset/summary/hooks/useOnlineAssetsQuery"
import { useAppSelector } from "@/lib/redux/hooks"
import { selectAssetOverview } from "@/features/asset/store/selectors"

export function AssetOverview() {
  const { isLoading, isError } = useOnlineAssetsQuery()
  const assetSummary = useAppSelector(selectAssetOverview)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(amount)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "game":
        return "🎮"
      case "music":
        return "🎵"
      case "gift":
        return "🎁"
      case "shopping":
        return "🛒"
      case "cash":
        return "💰"
      case "mileage":
        return "🧾"
      default:
        return "📦"
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case "game":
        return "게임"
      case "music":
        return "음악/영상"
      case "gift":
        return "기프트카드"
      case "shopping":
        return "쇼핑"
      case "cash":
        return "캐시"
      case "mileage":
        return "마일리지"
      default:
        return "기타"
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            자산 요약을 불러오는 중입니다
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-10 text-center text-sm text-destructive">
            자산 요약을 불러오지 못했습니다
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Total Asset Value */}
      <Card className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 opacity-90">
            <Package className="h-5 w-5" />총 자산 가치
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-2">{formatCurrency(assetSummary.totalValue)}</div>
          <div className="flex items-center gap-2 text-sm opacity-90">
            {assetSummary.monthlyChange > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span>
              {assetSummary.monthlyChange > 0 ? "+" : ""}
              {formatCurrency(assetSummary.monthlyChange)} 전월 대비
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Asset Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              개인 vs 공유 자산
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>개인 자산</span>
                <span>{formatCurrency(assetSummary.personalAssets)}</span>
              </div>
              <Progress
                value={assetSummary.totalValue > 0 ? (assetSummary.personalAssets / assetSummary.totalValue) * 100 : 0}
                className="h-2"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>공유 자산</span>
                <span>{formatCurrency(assetSummary.sharedAssets)}</span>
              </div>
              <Progress
                value={assetSummary.totalValue > 0 ? (assetSummary.sharedAssets / assetSummary.totalValue) * 100 : 0}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              카테고리별 분포
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(assetSummary.categoryBreakdown).map(([category, amount]) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getCategoryIcon(category)}</span>
                  <span className="text-sm">{getCategoryName(category)}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{formatCurrency(amount)}</div>
                  <div className="text-xs text-muted-foreground">
                    {assetSummary.totalValue > 0 ? ((amount / assetSummary.totalValue) * 100).toFixed(1) : '0.0'}%
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
