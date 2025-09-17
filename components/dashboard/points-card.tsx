"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Star, Gift, ShoppingBag, Coffee, Fuel, Smartphone } from "lucide-react"

interface PointsReward {
  id: string
  name: string
  description: string
  pointsCost: number
  category: "shopping" | "food" | "transport" | "mobile"
  available: boolean
}

const mockRewards: PointsReward[] = [
  {
    id: "1",
    name: "스타벅스 아메리카노",
    description: "스타벅스 아메리카노 1잔 교환권",
    pointsCost: 4500,
    category: "food",
    available: true,
  },
  {
    id: "2",
    name: "편의점 상품권 5,000원",
    description: "GS25, CU, 세븐일레븐 사용 가능",
    pointsCost: 5000,
    category: "shopping",
    available: true,
  },
  {
    id: "3",
    name: "지하철 교통카드 충전",
    description: "3,000원 교통카드 충전",
    pointsCost: 3000,
    category: "transport",
    available: true,
  },
  {
    id: "4",
    name: "휴대폰 요금 할인",
    description: "다음 달 휴대폰 요금 10,000원 할인",
    pointsCost: 10000,
    category: "mobile",
    available: false,
  },
]

export function PointsRewardsDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [userPoints] = useState(12500)

  const getCategoryIcon = (category: PointsReward["category"]) => {
    switch (category) {
      case "food":
        return <Coffee className="h-4 w-4" />
      case "shopping":
        return <ShoppingBag className="h-4 w-4" />
      case "transport":
        return <Fuel className="h-4 w-4" />
      case "mobile":
        return <Smartphone className="h-4 w-4" />
      default:
        return <Gift className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: PointsReward["category"]) => {
    switch (category) {
      case "food":
        return "bg-orange-100 text-orange-800"
      case "shopping":
        return "bg-blue-100 text-blue-800"
      case "transport":
        return "bg-green-100 text-green-800"
      case "mobile":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleRedeem = (reward: PointsReward) => {
    if (userPoints >= reward.pointsCost) {
      alert(`${reward.name}을(를) 교환했습니다!`)
      setIsOpen(false)
    } else {
      alert("포인트가 부족합니다.")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full bg-transparent">
          <Star className="mr-2 h-4 w-4" />
          포인트 사용하기
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            포인트 리워드
          </DialogTitle>
          <p className="text-sm text-muted-foreground">보유 포인트: {userPoints.toLocaleString()}P</p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto">
          {mockRewards.map((reward) => (
            <Card key={reward.id} className={`${!reward.available ? "opacity-50" : ""}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(reward.category)}
                    <CardTitle className="text-sm">{reward.name}</CardTitle>
                  </div>
                  <Badge className={getCategoryColor(reward.category)} variant="secondary">
                    {reward.pointsCost.toLocaleString()}P
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground mb-3">{reward.description}</p>
                <Button
                  size="sm"
                  className="w-full"
                  disabled={!reward.available || userPoints < reward.pointsCost}
                  onClick={() => handleRedeem(reward)}
                >
                  {!reward.available ? "품절" : userPoints < reward.pointsCost ? "포인트 부족" : "교환하기"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
