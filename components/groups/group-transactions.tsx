'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users } from 'lucide-react'
import { GroupTransactionsContainer } from '@/features/transaction/components/groups/group-transactions-container'

interface GroupTransactionsProps {
  groupId: string
}

export function GroupTransactions({ groupId }: GroupTransactionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          그룹 거래 내역
        </CardTitle>
      </CardHeader>
      <CardContent>{groupId && <GroupTransactionsContainer groupId={groupId} />}</CardContent>
    </Card>
  )
}
