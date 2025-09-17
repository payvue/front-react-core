"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownLeft, ShoppingCart, Users } from "lucide-react"

interface GroupTransaction {
  id: string
  type: "payment" | "contribution" | "withdrawal"
  amount: number
  description: string
  paidBy: string
  date: string
  status: "completed" | "pending"
  category: string
}

const mockTransactions: GroupTransaction[] = [
  {
    id: "1",
    type: "payment",
    amount: -45000,
    description: "가족 저녁 식사 - 한정식집",
    paidBy: "김아빠",
    date: "2024-01-15",
    status: "completed",
    category: "식비",
  },
  {
    id: "2",
    type: "contribution",
    amount: 50000,
    description: "김엄마 그룹 잔액 충전",
    paidBy: "김엄마",
    date: "2024-01-14",
    status: "completed",
    category: "충전",
  },
  {
    id: "3",
    type: "payment",
    amount: -25000,
    description: "마트 장보기",
    paidBy: "김형",
    date: "2024-01-13",
    status: "completed",
    category: "생활용품",
  },
  {
    id: "4",
    type: "contribution",
    amount: 100000,
    description: "김사용자 그룹 잔액 충전",
    paidBy: "김사용자",
    date: "2024-01-12",
    status: "completed",
    category: "충전",
  },
  {
    id: "5",
    type: "payment",
    amount: -15000,
    description: "온라인 쇼핑 - 생필품",
    paidBy: "김아빠",
    date: "2024-01-11",
    status: "pending",
    category: "온라인쇼핑",
  },
]

export function GroupTransactions() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(Math.abs(amount))
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "payment":
        return <ShoppingCart className="h-4 w-4 text-red-600" />
      case "contribution":
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />
      case "withdrawal":
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
      default:
        return <Badge variant="secondary">알 수 없음</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          그룹 거래 내역
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-full">{getTransactionIcon(transaction.type)}</div>
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{transaction.paidBy}</span>
                    <span>•</span>
                    <span>{transaction.date}</span>
                    <span>•</span>
                    <Badge variant="outline" className="text-xs">
                      {transaction.category}
                    </Badge>
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
