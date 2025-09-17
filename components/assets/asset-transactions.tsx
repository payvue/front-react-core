"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpRight, ArrowDownLeft, Share, Download } from "lucide-react"

interface AssetTransaction {
  id: string
  type: "purchase" | "use" | "share" | "receive"
  assetName: string
  amount: number
  date: string
  status: "completed" | "pending"
  relatedUser?: string
  groupName?: string
  category: string
}

const mockTransactions: AssetTransaction[] = [
  {
    id: "1",
    type: "purchase",
    assetName: "구글 플레이 기프트카드",
    amount: 50000,
    date: "2024-01-15",
    status: "completed",
    category: "기프트카드",
  },
  {
    id: "2",
    type: "share",
    assetName: "넷플릭스 프리미엄 구독권",
    amount: 17000,
    date: "2024-01-14",
    status: "completed",
    groupName: "가족 계정",
    category: "음악/영상",
  },
  {
    id: "3",
    type: "use",
    assetName: "스타벅스 기프트카드",
    amount: -15000,
    date: "2024-01-13",
    status: "completed",
    category: "기프트카드",
  },
  {
    id: "4",
    type: "receive",
    assetName: "스팀 게임 라이브러리",
    amount: 30000,
    date: "2024-01-12",
    status: "completed",
    relatedUser: "김형",
    groupName: "가족 계정",
    category: "게임",
  },
  {
    id: "5",
    type: "purchase",
    assetName: "애플 앱스토어 기프트카드",
    amount: 30000,
    date: "2024-01-11",
    status: "pending",
    category: "기프트카드",
  },
]

export function AssetTransactions() {
  const [transactions] = useState(mockTransactions)
  const [filterType, setFilterType] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(Math.abs(amount))
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "purchase":
        return <ArrowDownLeft className="h-4 w-4 text-blue-600" />
      case "use":
        return <ArrowUpRight className="h-4 w-4 text-red-600" />
      case "share":
        return <Share className="h-4 w-4 text-green-600" />
      case "receive":
        return <ArrowDownLeft className="h-4 w-4 text-purple-600" />
      default:
        return <ArrowDownLeft className="h-4 w-4" />
    }
  }

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case "purchase":
        return "구매"
      case "use":
        return "사용"
      case "share":
        return "공유"
      case "receive":
        return "받음"
      default:
        return "알 수 없음"
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
      default:
        return <Badge variant="secondary">알 수 없음</Badge>
    }
  }

  const filteredTransactions = transactions.filter((transaction) => {
    if (filterType !== "all" && transaction.type !== filterType) return false
    if (filterCategory !== "all" && transaction.category !== filterCategory) return false
    return true
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>자산 거래 내역</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="유형" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="purchase">구매</SelectItem>
                <SelectItem value="use">사용</SelectItem>
                <SelectItem value="share">공유</SelectItem>
                <SelectItem value="receive">받음</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="카테고리" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="게임">게임</SelectItem>
                <SelectItem value="음악/영상">음악/영상</SelectItem>
                <SelectItem value="기프트카드">기프트카드</SelectItem>
                <SelectItem value="쇼핑">쇼핑</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="bg-transparent">
              <Download className="mr-2 h-4 w-4" />
              내보내기
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-full">{getTransactionIcon(transaction.type)}</div>
                <div>
                  <p className="font-medium">{transaction.assetName}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      {getTransactionLabel(transaction.type)}
                    </Badge>
                    <span>{transaction.date}</span>
                    {transaction.groupName && (
                      <>
                        <span>•</span>
                        <span>{transaction.groupName}</span>
                      </>
                    )}
                    {transaction.relatedUser && (
                      <>
                        <span>•</span>
                        <span>{transaction.relatedUser}님으로부터</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-medium ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                  {transaction.amount > 0 ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </p>
                {getStatusBadge(transaction.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
