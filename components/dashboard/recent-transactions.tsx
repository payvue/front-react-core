"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownLeft, ShoppingCart, MoreHorizontal } from "lucide-react"
import Link from "next/link"

interface Transaction {
  id: string
  type: "payment" | "charge" | "transfer" | "asset_purchase" | "asset_use"
  amount: number
  description: string
  date: string
  status: "completed" | "pending" | "failed"
  category?: string
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
  },
  {
    id: "2",
    type: "payment",
    amount: -15000,
    description: "온라인 쇼핑몰 결제",
    date: "2024-01-14",
    status: "completed",
  },
  {
    id: "3",
    type: "charge",
    amount: 50000,
    description: "계좌 충전",
    date: "2024-01-14",
    status: "completed",
  },
  {
    id: "4",
    type: "asset_use",
    amount: -15000,
    description: "스타벅스 기프트카드 사용",
    date: "2024-01-13",
    status: "completed",
    category: "온라인 자산",
  },
  {
    id: "5",
    type: "transfer",
    amount: -25000,
    description: "김친구에게 송금",
    date: "2024-01-13",
    status: "completed",
  },
]

export function RecentTransactions() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(Math.abs(amount))
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>최근 거래 내역</CardTitle>
        <Button asChild variant="ghost" size="sm">
          <Link href="/assets?tab=transactions">
            <MoreHorizontal className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockTransactions.slice(0, 4).map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-full">{getTransactionIcon(transaction.type)}</div>
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{transaction.date}</span>
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
