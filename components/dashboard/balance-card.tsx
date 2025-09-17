"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, Plus, ArrowUpRight, Star, Gift } from "lucide-react"

interface User {
  balance: number
  points: number
}

export function BalanceCard() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser({
        ...parsedUser,
        points: parsedUser.points || 12500, // 기본 포인트 설정
      })
    }
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(amount)
  }

  const formatPoints = (points: number) => {
    return new Intl.NumberFormat("ko-KR").format(points)
  }

  if (!user) return null

  return (
    <div className="rounded-xl shadow-lg p-6 bg-gradient-to-br from-purple-50 to-purple-100">
      <Tabs defaultValue="balance" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="balance" className="text-xs">
            잔액
          </TabsTrigger>
          <TabsTrigger value="points" className="text-xs">
            포인트
          </TabsTrigger>
        </TabsList>

        <TabsContent value="balance" className="space-y-0">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-purple-900" style={{ color: "#581c87 !important" }}>
              보유 잔액
            </h3>
            <Wallet className="h-4 w-4 text-purple-700" style={{ color: "#7c3aed !important" }} />
          </div>
          <div className="pt-4">
            <div className="text-2xl font-bold mb-4 text-purple-900" style={{ color: "#581c87 !important" }}>
              {formatCurrency(user.balance)}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white border-0"
                style={{
                  backgroundColor: "#7c3aed !important",
                  color: "#ffffff !important",
                }}
              >
                <Plus className="mr-2 h-4 w-4 text-white" style={{ color: "#ffffff !important" }} />
                <span style={{ color: "#ffffff !important" }}>충전</span>
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white border-0"
                style={{
                  backgroundColor: "#7c3aed !important",
                  color: "#ffffff !important",
                }}
              >
                <ArrowUpRight className="mr-2 h-4 w-4 text-white" style={{ color: "#ffffff !important" }} />
                <span style={{ color: "#ffffff !important" }}>송금</span>
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="points" className="space-y-0">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-purple-900" style={{ color: "#581c87 !important" }}>
              보유 포인트
            </h3>
            <Star className="h-4 w-4 text-purple-700" style={{ color: "#7c3aed !important" }} />
          </div>
          <div className="pt-4">
            <div className="text-2xl font-bold mb-4 text-purple-900" style={{ color: "#581c87 !important" }}>
              {formatPoints(user.points)}P
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white border-0"
                style={{
                  backgroundColor: "#7c3aed !important",
                  color: "#ffffff !important",
                }}
              >
                <Gift className="mr-2 h-4 w-4 text-white" style={{ color: "#ffffff !important" }} />
                <span style={{ color: "#ffffff !important" }}>사용</span>
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white border-0"
                style={{
                  backgroundColor: "#7c3aed !important",
                  color: "#ffffff !important",
                }}
              >
                <Plus className="mr-2 h-4 w-4 text-white" style={{ color: "#ffffff !important" }} />
                <span style={{ color: "#ffffff !important" }}>적립</span>
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
