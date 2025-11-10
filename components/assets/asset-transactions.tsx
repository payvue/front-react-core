'use client'

import { Card, CardContent } from '@/components/ui/card'
import { AssetTransactionsContainer } from '@/features/transaction/components/asset/asset-transactions-container'

export function AssetTransactions() {
  return (
    <Card>
      <CardContent className="space-y-4">
        <AssetTransactionsContainer />
      </CardContent>
    </Card>
  )
}
