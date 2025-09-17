"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Star, Users, TrendingUp } from "lucide-react"

interface ShoppingMall {
  id: string
  name: string
  description: string
  logo: string
  category: string
  rating: number
  subscribers: number
  monthlyDeals: number
  isSubscribed: boolean
}

const mockShoppingMalls: ShoppingMall[] = [
  {
    id: "coupang",
    name: "쿠팡",
    description: "대한민국 대표 이커머스 플랫폼",
    logo: "🛒",
    category: "종합몰",
    rating: 4.5,
    subscribers: 15000000,
    monthlyDeals: 2500,
    isSubscribed: false,
  },
  {
    id: "gmarket",
    name: "G마켓",
    description: "다양한 상품과 할인 혜택",
    logo: "🏪",
    category: "종합몰",
    rating: 4.2,
    subscribers: 8000000,
    monthlyDeals: 1800,
    isSubscribed: false,
  },
  {
    id: "11st",
    name: "11번가",
    description: "SK그룹의 온라인 쇼핑몰",
    logo: "🏬",
    category: "종합몰",
    rating: 4.1,
    subscribers: 6000000,
    monthlyDeals: 1200,
    isSubscribed: false,
  },
  {
    id: "auction",
    name: "옥션",
    description: "경매와 쇼핑이 함께",
    logo: "🔨",
    category: "경매/중고",
    rating: 3.9,
    subscribers: 4000000,
    monthlyDeals: 800,
    isSubscribed: false,
  },
  {
    id: "oliveyoung",
    name: "올리브영",
    description: "뷰티 전문 쇼핑몰",
    logo: "💄",
    category: "뷰티",
    rating: 4.6,
    subscribers: 3000000,
    monthlyDeals: 600,
    isSubscribed: false,
  },
  {
    id: "musinsa",
    name: "무신사",
    description: "패션 전문 플랫폼",
    logo: "👕",
    category: "패션",
    rating: 4.4,
    subscribers: 2500000,
    monthlyDeals: 400,
    isSubscribed: false,
  },
  {
    id: "kurly",
    name: "마켓컬리",
    description: "신선식품 전문 배송 서비스",
    logo: "🥬",
    category: "식품",
    rating: 4.3,
    subscribers: 2000000,
    monthlyDeals: 350,
    isSubscribed: false,
  },
  {
    id: "yes24",
    name: "YES24",
    description: "도서 및 문화상품 전문몰",
    logo: "📚",
    category: "도서/문화",
    rating: 4.4,
    subscribers: 1800000,
    monthlyDeals: 280,
    isSubscribed: false,
  },
]

interface ShoppingMallListProps {
  subscribedMalls: string[]
  onSubscriptionChange: (malls: string[]) => void
}

export function ShoppingMallList({ subscribedMalls, onSubscriptionChange }: ShoppingMallListProps) {
  const [malls, setMalls] = useState<ShoppingMall[]>(
    mockShoppingMalls.map((mall) => ({
      ...mall,
      isSubscribed: subscribedMalls.includes(mall.id),
    })),
  )

  const handleSubscriptionToggle = (mallId: string) => {
    const updatedMalls = malls.map((mall) =>
      mall.id === mallId ? { ...mall, isSubscribed: !mall.isSubscribed } : mall,
    )
    setMalls(updatedMalls)

    const newSubscribedMalls = updatedMalls.filter((mall) => mall.isSubscribed).map((mall) => mall.id)
    onSubscriptionChange(newSubscribedMalls)

    // 로컬 스토리지에 저장
    localStorage.setItem("subscribedMalls", JSON.stringify(newSubscribedMalls))
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">쇼핑몰 구독 관리</h2>
        <p className="text-muted-foreground">관심 있는 쇼핑몰을 구독하여 상품 정보를 받아보세요</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {malls.map((mall) => (
          <Card key={mall.id} className={`transition-all ${mall.isSubscribed ? "ring-2 ring-primary" : ""}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{mall.logo}</div>
                  <div>
                    <CardTitle className="text-lg">{mall.name}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {mall.category}
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Switch checked={mall.isSubscribed} onCheckedChange={() => handleSubscriptionToggle(mall.id)} />
                  {mall.isSubscribed && (
                    <Badge variant="default" className="text-xs bg-primary">
                      구독중
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{mall.description}</p>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span className="text-sm font-medium">{mall.rating}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">평점</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Users className="h-3 w-3 text-blue-500" />
                    <span className="text-sm font-medium">{formatNumber(mall.subscribers)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">구독자</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-sm font-medium">{formatNumber(mall.monthlyDeals)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">월 거래</p>
                </div>
              </div>

              {mall.isSubscribed && (
                <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                  <p className="text-xs text-primary font-medium">구독 중 - 상품 정보를 받아보고 있습니다</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
