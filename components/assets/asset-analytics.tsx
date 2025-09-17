"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, Target, Award, AlertCircle } from "lucide-react"

const monthlySpendingData = [
  { month: "10월", amount: 120000 },
  { month: "11월", amount: 150000 },
  { month: "12월", amount: 180000 },
  { month: "1월", amount: 220000 },
]

const categoryData = [
  { name: "게임", value: 150000, color: "#a855f7" },
  { name: "음악/영상", value: 80000, color: "#c084fc" },
  { name: "기프트카드", value: 120000, color: "#d8b4fe" },
  { name: "쇼핑", value: 100000, color: "#e9d5ff" },
]

const insights = [
  {
    type: "trend",
    title: "지출 증가 추세",
    description: "최근 3개월간 온라인 자산 구매가 25% 증가했습니다.",
    severity: "info",
  },
  {
    type: "saving",
    title: "그룹 공유 절약",
    description: "그룹 자산 공유로 이번 달 약 45,000원을 절약했습니다.",
    severity: "positive",
  },
  {
    type: "warning",
    title: "미사용 자산 알림",
    description: "3개의 기프트카드가 30일 이상 미사용 상태입니다.",
    severity: "warning",
  },
]

export function AssetAnalytics() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR").format(amount)
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "positive":
        return <Award className="h-4 w-4 text-green-600" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "info":
        return <TrendingUp className="h-4 w-4" style={{ color: "#7c3aed" }} />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "positive":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            절약
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            주의
          </Badge>
        )
      case "info":
        return (
          <Badge variant="secondary" style={{ backgroundColor: "#e9d5ff", color: "#581c87" }}>
            정보
          </Badge>
        )
      default:
        return <Badge variant="secondary">일반</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Monthly Spending Trend */}
      <Card>
        <CardHeader>
          <CardTitle style={{ color: "#581c87" }}>월별 자산 구매 추이</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlySpendingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `₩${formatCurrency(value)}`} />
              <Tooltip formatter={(value) => [`₩${formatCurrency(Number(value))}`, "구매 금액"]} />
              <Bar dataKey="amount" fill="#7c3aed" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle style={{ color: "#581c87" }}>카테고리별 자산 분포</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₩${formatCurrency(Number(value))}`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {categoryData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-sm" style={{ color: "#6b46c1" }}>
                    {entry.name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card>
          <CardHeader>
            <CardTitle style={{ color: "#581c87" }}>인사이트 및 추천</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="p-4 rounded-lg border border-purple-200">
                <div className="flex items-start gap-3">
                  <div className="p-1">{getSeverityIcon(insight.severity)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium" style={{ color: "#581c87" }}>
                        {insight.title}
                      </h4>
                      {getSeverityBadge(insight.severity)}
                    </div>
                    <p className="text-sm" style={{ color: "#6b46c1" }}>
                      {insight.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
