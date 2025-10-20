import { createElement, ReactNode } from "react"
import { Gamepad2, Gift, Music, Plane, ShoppingCart, Wallet } from "lucide-react"
import { OnlineAssetCategory, OnlineAssetStatus } from "../types/online-asset"

type BadgeVariant = "default" | "secondary" | "destructive" | "outline"

interface StatusMeta {
  label: string
  variant: BadgeVariant
  className?: string
}

export const resolveAssetIcon = (category: OnlineAssetCategory): ReactNode => {
  switch (category) {
    case "game":
      return createElement(Gamepad2, { className: "h-5 w-5" })
    case "music":
      return createElement(Music, { className: "h-5 w-5" })
    case "shopping":
      return createElement(ShoppingCart, { className: "h-5 w-5" })
    case "cash":
      return createElement(Wallet, { className: "h-5 w-5" })
    case "mileage":
      return createElement(Plane, { className: "h-5 w-5" })
    case "gift":
    default:
      return createElement(Gift, { className: "h-5 w-5" })
  }
}

export const resolveCategoryLabel = (category: OnlineAssetCategory) => {
  switch (category) {
    case "game":
      return "게임"
    case "music":
      return "음악"
    case "shopping":
      return "쇼핑"
    case "cash":
      return "캐시"
    case "mileage":
      return "마일리지"            
    case "gift":
    default:
      return "기프트 카드"
  }
}

export const resolveStatusMeta = (status: OnlineAssetStatus): StatusMeta => {
  switch (status) {
    case "used":
      return {
        label: "사용 완료",
        variant: "secondary",
        className: "bg-muted text-muted-foreground",
      }
    case "expired":
      return {
        label: "만료",
        variant: "destructive",
      }
    case "active":
    default:
      return {
        label: "사용 가능",
        variant: "secondary",
        className: "bg-emerald-100 text-emerald-700",
      }
  }
}

export const formatAssetAmount = (amount: number) => {
  return new Intl.NumberFormat("ko-KR").format(amount)
}
