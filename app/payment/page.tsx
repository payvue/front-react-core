"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PaymentMethods } from "@/components/payment/payment-methods"
import { ChargeBalance } from "@/components/payment/charge-balance"
import { OnlineAssets } from "@/components/payment/online-assets"
import { MoneyTransfer } from "@/components/payment/money-transfer"
import { ScheduledPayments } from "@/components/payment/scheduled-payments"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PaymentPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      window.location.href = "/login"
      return
    }
    setIsLoggedIn(true)
  }, [])

  if (!isLoggedIn) {
    return <div>로딩 중...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">결제 관리</h1>
          <p className="text-muted-foreground">결제 수단, 잔액 충전, 온라인 재화를 관리하세요</p>
        </div>

        <Tabs defaultValue="charge" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="charge">잔액 충전</TabsTrigger>
            <TabsTrigger value="assets">온라인 재화</TabsTrigger>
            <TabsTrigger value="transfer">송금</TabsTrigger>
            <TabsTrigger value="scheduled">예약 결제</TabsTrigger>
            <TabsTrigger value="methods">결제 수단</TabsTrigger>
          </TabsList>

          <TabsContent value="charge" className="space-y-6">
            <ChargeBalance />
          </TabsContent>

          <TabsContent value="assets" className="space-y-6">
            <OnlineAssets />
          </TabsContent>

          <TabsContent value="transfer" className="space-y-6">
            <MoneyTransfer />
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-6">
            <ScheduledPayments />
          </TabsContent>

          <TabsContent value="methods" className="space-y-6">
            <PaymentMethods />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
