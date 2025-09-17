"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ShoppingMallList } from "@/components/shopping/shopping-mall-list"
import { ProductGrid } from "@/components/shopping/product-grid"
import { WishlistPage } from "@/components/shopping/wishlist-page"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Store, Star, Heart } from "lucide-react"

export default function ShoppingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [subscribedMalls, setSubscribedMalls] = useState<string[]>([])

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      window.location.href = "/login"
      return
    }
    setIsLoggedIn(true)

    // 구독된 쇼핑몰 목록 로드
    const subscriptions = localStorage.getItem("subscribedMalls")
    if (subscriptions) {
      setSubscribedMalls(JSON.parse(subscriptions))
    }
  }, [])

  if (!isLoggedIn) {
    return <div>로딩 중...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <ShoppingBag className="h-8 w-8 text-primary" />
                PayEasy 쇼핑
              </h1>
              <p className="text-muted-foreground">구독한 쇼핑몰의 상품을 한 곳에서 확인하고 결제하세요</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">구독 쇼핑몰</CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{subscribedMalls.length}</div>
                <p className="text-xs text-muted-foreground">활성 구독</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">이번 달 쇼핑</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₩89,500</div>
                <p className="text-xs text-muted-foreground">7건 구매</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">적립 포인트</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">2,150P</div>
                <p className="text-xs text-muted-foreground">이번 달 적립</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">상품 목록</TabsTrigger>
            <TabsTrigger value="wishlist" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              관심 상품
            </TabsTrigger>
            <TabsTrigger value="malls">쇼핑몰 관리</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">추천 상품</h2>
              <div className="flex gap-2">
                {subscribedMalls.map((mallId) => (
                  <Badge key={mallId} variant="secondary">
                    {mallId === "coupang" && "쿠팡"}
                    {mallId === "gmarket" && "G마켓"}
                    {mallId === "11st" && "11번가"}
                    {mallId === "auction" && "옥션"}
                  </Badge>
                ))}
              </div>
            </div>
            <ProductGrid subscribedMalls={subscribedMalls} />
          </TabsContent>

          <TabsContent value="wishlist" className="space-y-6">
            <WishlistPage />
          </TabsContent>

          <TabsContent value="malls" className="space-y-6">
            <ShoppingMallList subscribedMalls={subscribedMalls} onSubscriptionChange={setSubscribedMalls} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
