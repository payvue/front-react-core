"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Smartphone, Building2, Plus, Trash2 } from "lucide-react"

interface PaymentMethod {
  id: string
  type: "card" | "bank" | "mobile"
  name: string
  details: string
  isDefault: boolean
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "1",
    type: "card",
    name: "신한카드",
    details: "**** **** **** 1234",
    isDefault: true,
  },
  {
    id: "2",
    type: "bank",
    name: "국민은행",
    details: "110-***-******",
    isDefault: false,
  },
  {
    id: "3",
    type: "mobile",
    name: "카카오페이",
    details: "연결됨",
    isDefault: false,
  },
]

export function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods)

  const getIcon = (type: string) => {
    switch (type) {
      case "card":
        return <CreditCard className="h-5 w-5" />
      case "bank":
        return <Building2 className="h-5 w-5" />
      case "mobile":
        return <Smartphone className="h-5 w-5" />
      default:
        return <CreditCard className="h-5 w-5" />
    }
  }

  const handleDelete = (id: string) => {
    setPaymentMethods(paymentMethods.filter((method) => method.id !== id))
  }

  const handleSetDefault = (id: string) => {
    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      })),
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>결제 수단 관리</CardTitle>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          추가
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {paymentMethods.map((method) => (
          <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-full">{getIcon(method.type)}</div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{method.name}</p>
                  {method.isDefault && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      기본
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{method.details}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!method.isDefault && (
                <Button variant="outline" size="sm" onClick={() => handleSetDefault(method.id)}>
                  기본 설정
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => handleDelete(method.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
