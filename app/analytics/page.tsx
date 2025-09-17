"use client"

import { TransactionAnalytics } from "@/components/analytics/transaction-analytics"
import { BarChart3 } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">거래 분석</h1>
            <p className="text-muted-foreground">상세한 거래 내역과 분석을 확인하세요</p>
          </div>
        </div>

        <TransactionAnalytics />
      </div>
    </div>
  )
}
