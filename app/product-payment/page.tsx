"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProductPayment } from "@/components/payment/product-payment"

export default function ProductPaymentPage() {
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
          <h1 className="text-3xl font-bold mb-2">상품 결제</h1>
          <p className="text-muted-foreground">선택한 상품을 결제하세요</p>
        </div>

        <ProductPayment />
      </main>
    </div>
  )
}
