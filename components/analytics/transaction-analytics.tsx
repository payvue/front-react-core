"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TransactionFilters } from "./transaction-filters"
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  ShoppingCart,
  Calendar,
  PieChart,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Eye,
  CreditCard,
  MapPin,
  Clock,
} from "lucide-react"

interface Transaction {
  id: string
  type: "payment" | "charge" | "transfer" | "asset_purchase" | "asset_use"
  amount: number
  description: string
  date: string
  status: "completed" | "pending" | "failed"
  category?: string
  paymentMethod?: string
  platform?: string
  location?: string
  time?: string
  merchantId?: string
  transactionFee?: number
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "asset_purchase",
    amount: -50000,
    description: "구글 플레이 기프트카드 구매",
    date: "2024-01-15",
    status: "completed",
    category: "온라인 자산",
    paymentMethod: "신용카드",
    platform: "Google Play Store",
    location: "온라인",
    time: "14:30",
    merchantId: "GP-12345",
    transactionFee: 0,
  },
  {
    id: "2",
    type: "payment",
    amount: -15000,
    description: "온라인 쇼핑몰 결제",
    date: "2024-01-14",
    status: "completed",
    category: "쇼핑",
    paymentMethod: "PayEasy 잔액",
    platform: "쿠팡",
    location: "온라인",
    time: "20:15",
    merchantId: "CP-67890",
    transactionFee: 150,
  },
  {
    id: "3",
    type: "charge",
    amount: 100000,
    description: "계좌 충전",
    date: "2024-01-14",
    status: "completed",
    paymentMethod: "은행 계좌",
    platform: "PayEasy",
    location: "온라인",
    time: "09:00",
    merchantId: "PE-78901",
    transactionFee: 0,
  },
  {
    id: "4",
    type: "asset_use",
    amount: -15000,
    description: "스타벅스 기프트카드 사용",
    date: "2024-01-13",
    status: "completed",
    category: "식음료",
    paymentMethod: "기프트카드",
    platform: "스타벅스",
    location: "강남점",
    time: "08:45",
    merchantId: "SB-11111",
    transactionFee: 0,
  },
  {
    id: "5",
    type: "transfer",
    amount: -25000,
    description: "김친구에게 송금",
    date: "2024-01-13",
    status: "completed",
    paymentMethod: "PayEasy 잔액",
    platform: "PayEasy",
    location: "온라인",
    time: "16:20",
    merchantId: "PE-22222",
    transactionFee: 500,
  },
  {
    id: "6",
    type: "payment",
    amount: -8000,
    description: "지하철 교통카드 충전",
    date: "2024-01-12",
    status: "completed",
    category: "교통",
    paymentMethod: "PayEasy 잔액",
    platform: "서울교통공사",
    location: "강남역",
    time: "07:30",
    merchantId: "ST-33333",
    transactionFee: 0,
  },
  {
    id: "7",
    type: "asset_purchase",
    amount: -30000,
    description: "넷플릭스 기프트카드 구매",
    date: "2024-01-11",
    status: "completed",
    category: "엔터테인먼트",
    paymentMethod: "신용카드",
    platform: "Netflix",
    location: "온라인",
    time: "21:00",
    merchantId: "NF-44444",
    transactionFee: 0,
  },
  {
    id: "8",
    type: "payment",
    amount: -12000,
    description: "배달음식 주문",
    date: "2024-01-10",
    status: "completed",
    category: "식음료",
    paymentMethod: "PayEasy 잔액",
    platform: "배달의민족",
    location: "온라인",
    time: "19:45",
    merchantId: "BM-55555",
    transactionFee: 300,
  },
]

const generateMoreTransactions = (startId: number, count: number): Transaction[] => {
  const types: Transaction["type"][] = ["payment", "charge", "transfer", "asset_purchase", "asset_use"]
  const categories = ["쇼핑", "식음료", "교통", "엔터테인먼트", "온라인 자산"]
  const platforms = ["쿠팡", "배달의민족", "스타벅스", "지하철", "Google Play"]

  return Array.from({ length: count }, (_, i) => ({
    id: (startId + i).toString(),
    type: types[Math.floor(Math.random() * types.length)],
    amount:
      Math.random() > 0.3 ? -(Math.floor(Math.random() * 50000) + 5000) : Math.floor(Math.random() * 100000) + 10000,
    description: `거래 내역 ${startId + i}`,
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    status: Math.random() > 0.1 ? "completed" : "pending",
    category: categories[Math.floor(Math.random() * categories.length)],
    paymentMethod: Math.random() > 0.5 ? "PayEasy 잔액" : "신용카드",
    platform: platforms[Math.floor(Math.random() * platforms.length)],
    location: Math.random() > 0.5 ? "온라인" : "오프라인",
    time: `${Math.floor(Math.random() * 24)
      .toString()
      .padStart(2, "0")}:${Math.floor(Math.random() * 60)
      .toString()
      .padStart(2, "0")}`,
    merchantId: `TX-${(startId + i).toString().padStart(5, "0")}`,
    transactionFee: Math.random() > 0.7 ? Math.floor(Math.random() * 1000) : 0,
  }))
}

export function TransactionAnalytics() {
  const [filters, setFilters] = useState({
    dateRange: { start: "", end: "" },
    transactionType: "all",
    category: "all",
    status: "all",
    amountRange: { min: "", max: "" },
  })

  const [displayedTransactions, setDisplayedTransactions] = useState<Transaction[]>([])
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(null)
  const observerRef = useRef<HTMLDivElement>(null)
  const ITEMS_PER_PAGE = 5

  useEffect(() => {
    const initialTransactions = [...mockTransactions, ...generateMoreTransactions(100, 50)]
    setAllTransactions(initialTransactions)
    setDisplayedTransactions(initialTransactions.slice(0, ITEMS_PER_PAGE))
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && displayedTransactions.length < filteredTransactions.length) {
          loadMoreTransactions()
        }
      },
      { threshold: 0.1 },
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => observer.disconnect()
  }, [displayedTransactions, isLoading])

  const loadMoreTransactions = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const nextPage = currentPage + 1
    const startIndex = (nextPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const newTransactions = filteredTransactions.slice(startIndex, endIndex)

    setDisplayedTransactions((prev) => [...prev, ...newTransactions])
    setCurrentPage(nextPage)
    setIsLoading(false)
  }

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((transaction) => {
      if (filters.dateRange.start && transaction.date < filters.dateRange.start) return false
      if (filters.dateRange.end && transaction.date > filters.dateRange.end) return false
      if (filters.transactionType !== "all" && transaction.type !== filters.transactionType) return false
      if (filters.category !== "all" && transaction.category !== filters.category) return false
      if (filters.status !== "all" && transaction.status !== filters.status) return false
      const absAmount = Math.abs(transaction.amount)
      if (filters.amountRange.min && absAmount < Number(filters.amountRange.min)) return false
      if (filters.amountRange.max && absAmount > Number(filters.amountRange.max)) return false
      return true
    })
  }, [filters, allTransactions])

  useEffect(() => {
    setDisplayedTransactions(filteredTransactions.slice(0, ITEMS_PER_PAGE))
    setCurrentPage(1)
    setExpandedTransaction(null)
  }, [filteredTransactions])

  const analytics = useMemo(() => {
    const totalIncome = filteredTransactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)
    const totalExpense = filteredTransactions
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    const categoryStats = filteredTransactions
      .filter((t) => t.category)
      .reduce(
        (acc, t) => {
          const category = t.category!
          if (!acc[category]) acc[category] = { count: 0, amount: 0 }
          acc[category].count++
          acc[category].amount += Math.abs(t.amount)
          return acc
        },
        {} as Record<string, { count: number; amount: number }>,
      )

    const typeStats = filteredTransactions.reduce(
      (acc, t) => {
        if (!acc[t.type]) acc[t.type] = { count: 0, amount: 0 }
        acc[t.type].count++
        acc[t.type].amount += Math.abs(t.amount)
        return acc
      },
      {} as Record<string, { count: number; amount: number }>,
    )

    return {
      totalIncome,
      totalExpense,
      netAmount: totalIncome - totalExpense,
      transactionCount: filteredTransactions.length,
      categoryStats,
      typeStats,
    }
  }, [filteredTransactions])

  const resetFilters = () => {
    setFilters({
      dateRange: { start: "", end: "" },
      transactionType: "all",
      category: "all",
      status: "all",
      amountRange: { min: "", max: "" },
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(amount)
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "payment":
      case "asset_purchase":
      case "asset_use":
        return <ShoppingCart className="h-4 w-4" />
      case "charge":
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />
      case "transfer":
        return <ArrowUpRight className="h-4 w-4 text-blue-600" />
      default:
        return <ShoppingCart className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            완료
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            대기
          </Badge>
        )
      case "failed":
        return <Badge variant="destructive">실패</Badge>
      default:
        return <Badge variant="secondary">알 수 없음</Badge>
    }
  }

  const toggleTransactionDetails = (transactionId: string) => {
    setExpandedTransaction(expandedTransaction === transactionId ? null : transactionId)
  }

  return (
    <div className="space-y-6">
      <TransactionFilters filters={filters} onFiltersChange={setFilters} onReset={resetFilters} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">총 수입</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(analytics.totalIncome)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">총 지출</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(analytics.totalExpense)}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">순 금액</p>
                <p className={`text-2xl font-bold ${analytics.netAmount >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatCurrency(analytics.netAmount)}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">거래 건수</p>
                <p className="text-2xl font-bold">{analytics.transactionCount}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              카테고리별 분석
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(analytics.categoryStats)
                .sort(([, a], [, b]) => b.amount - a.amount)
                .map(([category, stats]) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{category}</Badge>
                      <span className="text-sm text-muted-foreground">{stats.count}건</span>
                    </div>
                    <span className="font-medium">{formatCurrency(stats.amount)}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              거래 유형별 분석
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(analytics.typeStats)
                .sort(([, a], [, b]) => b.amount - a.amount)
                .map(([type, stats]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTransactionIcon(type)}
                      <span className="text-sm">
                        {type === "payment"
                          ? "일반 결제"
                          : type === "charge"
                            ? "충전"
                            : type === "transfer"
                              ? "송금"
                              : type === "asset_purchase"
                                ? "자산 구매"
                                : type === "asset_use"
                                  ? "자산 사용"
                                  : type}
                      </span>
                      <span className="text-sm text-muted-foreground">{stats.count}건</span>
                    </div>
                    <span className="font-medium">{formatCurrency(stats.amount)}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>거래 내역 ({analytics.transactionCount}건)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {displayedTransactions.map((transaction) => (
              <div key={transaction.id} className="border rounded-lg overflow-hidden">
                <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-full">{getTransactionIcon(transaction.type)}</div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{transaction.date}</span>
                        <span>{transaction.time}</span>
                        {transaction.category && (
                          <>
                            <span>•</span>
                            <Badge variant="outline" className="text-xs">
                              {transaction.category}
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className={`font-medium ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                        {transaction.amount > 0 ? "+" : "-"}
                        {formatCurrency(Math.abs(transaction.amount))}
                      </p>
                      {getStatusBadge(transaction.status)}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleTransactionDetails(transaction.id)}
                      className="p-2"
                    >
                      <Eye className="h-4 w-4" />
                      {expandedTransaction === transaction.id ? (
                        <ChevronUp className="h-4 w-4 ml-1" />
                      ) : (
                        <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </Button>
                  </div>
                </div>

                {expandedTransaction === transaction.id && (
                  <div className="border-t bg-muted/20 p-4 animate-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">결제 수단:</span>
                          <span className="text-sm">{transaction.paymentMethod}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">결제 플랫폼:</span>
                          <span className="text-sm">{transaction.platform}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">결제 위치:</span>
                          <span className="text-sm">{transaction.location}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">결제 일시:</span>
                          <span className="text-sm">
                            {transaction.date} {transaction.time}
                          </span>
                        </div>
                        {transaction.merchantId && (
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              거래 ID: {transaction.merchantId}
                            </Badge>
                          </div>
                        )}
                        {transaction.transactionFee && transaction.transactionFee > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">수수료:</span>
                            <span className="text-sm text-red-600">{formatCurrency(transaction.transactionFee)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            )}

            {displayedTransactions.length < filteredTransactions.length && <div ref={observerRef} className="h-4" />}

            {displayedTransactions.length >= filteredTransactions.length && filteredTransactions.length > 0 && (
              <div className="text-center py-4 text-muted-foreground">모든 거래 내역을 불러왔습니다.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
