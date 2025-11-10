'use client'

import { TransactionContainer } from '../transaction-container'
import { useGroupTransactionsQuery } from '../../hooks/useGroupTransactionsQuery'
import { groupTransactionBuilder } from '../../model/group-transaction-builder'
import { GroupTransactionsList } from '../group/group-transactions-list'
import { GroupTransactionSchema } from '../../types/group'
import { TransactionModel } from '../../types'

interface GroupTransactionsContainerProps {
  groupId: string
}

export function GroupTransactionsContainer({ groupId }: GroupTransactionsContainerProps) {
  const groupQuery = useGroupTransactionsQuery(groupId)

  return (
    <TransactionContainer<GroupTransactionSchema, TransactionModel>
      queryResult={groupQuery}
      modelBuilder={groupTransactionBuilder}
      listComponent={GroupTransactionsList}
      paginationConfig={{ pageSize: 5 }}
    />
  )
}
