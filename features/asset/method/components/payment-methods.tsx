"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, RefreshCw } from "lucide-react"
import { usePaymentMethodsQuery } from "@/features/asset/method/hooks/usePaymentMethodsQuery"
import { PaymentMethodModel } from "@/features/asset/method/model/payment-method-type"
import PaymentMethodList from "./payment-methods-list"

export function PaymentMethods() {
  const { methods, isLoading, isError, refetch } = usePaymentMethodsQuery()
  const [items, setItems] = useState<PaymentMethodModel[]>([])

  useEffect(() => {
    setItems(methods)
  }, [methods])

  const showEmptyState = useMemo(
    () => items.length === 0 && !isLoading && !isError,
    [isError, isLoading, items.length],
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>결제 수단 관리</CardTitle>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            새로고침
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            추가
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <PaymentMethodList
          methods={items}
          isLoading={isLoading}
          isError={isError}
          showEmptyState={showEmptyState}
          onDelete={(id) => setItems((prev) => prev.filter((method) => method.id !== id))}
          onSetDefault={(id) => setItems((prev) => prev.map((method) => method.withDefault(method.id === id)))}
        />
      </CardContent>
    </Card>
  )
}
