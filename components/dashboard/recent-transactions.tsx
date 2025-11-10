'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { MoreHorizontal } from 'lucide-react'
import {
  TransactionContainer,
  historyBuilder,
  useTransactionHistoryQuery,
  DashboardRecentTransactionsList,
} from '@/features/transaction'

export function RecentTransactions() {
  const recentQuery = useTransactionHistoryQuery({ count: 4 })

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
        <TransactionContainer
          queryResult={recentQuery}
          modelBuilder={historyBuilder}
          listComponent={DashboardRecentTransactionsList}
          paginationConfig={{ pageSize: 4 }}
        />
      </CardContent>
    </Card>
  )
}
