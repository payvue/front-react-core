"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { GroupTransactions } from "@/components/groups/group-transactions"
import { GroupMembers } from "@/components/groups/group-members"
import { SharedAssets } from "@/components/groups/shared-assets"
import { PaymentRequests } from "@/components/groups/payment-requests"
import { GroupBalanceChargeDialog } from "@/components/groups/group-balance-charge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, DollarSign, Settings, Crown } from "lucide-react"

interface GroupDetails {
  id: string
  name: string
  description: string
  memberCount: number
  sharedBalance: number
  role: "admin" | "member"
  createdDate: string
}

const mockGroupDetails: GroupDetails = {
  id: "1",
  name: "가족 계정",
  description: "우리 가족 공용 결제 계정",
  memberCount: 4,
  sharedBalance: 250000,
  role: "admin",
  createdDate: "2024-01-01",
}

export default function GroupDetailPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [groupDetails] = useState(mockGroupDetails)
  const [userBalance] = useState(150000) // 개인 잔액

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      window.location.href = "/login"
      return
    }
    setIsLoggedIn(true)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(amount)
  }

  if (!isLoggedIn) {
    return <div>로딩 중...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-6 py-8">
        {/* Group Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{groupDetails.name}</h1>
                {groupDetails.role === "admin" && <Crown className="h-6 w-6 text-yellow-500" />}
                <Badge variant={groupDetails.role === "admin" ? "default" : "secondary"}>
                  {groupDetails.role === "admin" ? "관리자" : "멤버"}
                </Badge>
              </div>
              <p className="text-muted-foreground">{groupDetails.description}</p>
            </div>
            <div className="flex gap-2">
              <GroupBalanceChargeDialog groupId={groupDetails.id} currentUserBalance={userBalance} />
              {groupDetails.role === "admin" && (
                <Button variant="outline" className="bg-transparent">
                  <Settings className="mr-2 h-4 w-4" />
                  그룹 설정
                </Button>
              )}
            </div>
          </div>

          {/* Group Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">공용 잔액</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{formatCurrency(groupDetails.sharedBalance)}</div>
                <p className="text-xs text-muted-foreground">그룹 전체 사용 가능</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">그룹 멤버</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{groupDetails.memberCount}</div>
                <p className="text-xs text-muted-foreground">활성 멤버</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">이번 달 사용</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₩127,500</div>
                <p className="text-xs text-muted-foreground">+12% 전월 대비</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Group Content Tabs */}
        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="transactions">거래 내역</TabsTrigger>
            <TabsTrigger value="requests">결제 요청</TabsTrigger>
            <TabsTrigger value="members">멤버 관리</TabsTrigger>
            <TabsTrigger value="assets">공유 재화</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-6">
            <GroupTransactions />
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <PaymentRequests
              groupId={groupDetails.id}
              currentUserId="current-user-id"
              isGroupLeader={groupDetails.role === "admin"}
            />
          </TabsContent>

          <TabsContent value="members" className="space-y-6">
            <GroupMembers />
          </TabsContent>

          <TabsContent value="assets" className="space-y-6">
            <SharedAssets />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
