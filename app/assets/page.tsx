"use client"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AssetOverview } from "@/components/assets/asset-overview"
import { AssetTransactions } from "@/components/assets/asset-transactions"
import { AssetAnalytics } from "@/components/assets/asset-analytics"
import { OnlineAssets } from "@/features/asset/summary/components/online-assets"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AssetsPage() {

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">온라인 자산 관리</h1>
          <p className="text-muted-foreground">개인 및 그룹 온라인 자산을 통합 관리하고 분석하세요</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">개요</TabsTrigger>
            <TabsTrigger value="assets">자산 목록</TabsTrigger>
            <TabsTrigger value="transactions">거래 내역</TabsTrigger>
            <TabsTrigger value="analytics">분석</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <AssetOverview />
          </TabsContent>

          <TabsContent value="assets" className="space-y-6">
            <OnlineAssets />
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <AssetTransactions />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AssetAnalytics />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
