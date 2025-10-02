"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { BalanceCard } from "@/components/dashboard/balance-card"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { PointsRewardsDialog } from "@/components/dashboard/points-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, CreditCard, TrendingUp } from "lucide-react"
import { useUserContext } from "@/components/context/user"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const { isAuthenticated } = useUserContext()
  const router = useRouter()

  useEffect(() => {

    if(!isAuthenticated()) {
      router.push('/login')
      return
    }

    setIsLoggedIn(true)
  
  }, [])

  if (!isLoggedIn) {
    return <div>로딩 중...</div>
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <BalanceCard />

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">그룹 계정</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">참여 중인 그룹</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">이번 달 결제</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₩127,500</div>
              <p className="text-xs text-muted-foreground">+12% 전월 대비</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RecentTransactions />

          <Card>
            <CardHeader>
              <CardTitle>빠른 액션</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <CreditCard className="mr-2 h-4 w-4" />새 결제 수단 추가
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                그룹 계정 만들기
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <TrendingUp className="mr-2 h-4 w-4" />
                결제 분석 보기
              </Button>
              <PointsRewardsDialog />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
