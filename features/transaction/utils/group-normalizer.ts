import { GroupTransactionSchema, GroupTransactionKind } from '../types/group'
import { TransactionStatus } from '../types'

interface GroupApiTransaction {
  id: string
  type: 'payment' | 'contribution' | 'withdrawal'
  amount: number
  description: string
  paidBy: string
  date: string
  status: 'completed' | 'pending' | 'failed' | 'refunded'
  category?: string
}

const typeMap: Record<GroupApiTransaction['type'], GroupTransactionKind> = {
  payment: 'payment',
  contribution: 'group_contribution',
  withdrawal: 'group_withdrawal',
}

const statusMap: Record<GroupApiTransaction['status'], TransactionStatus> = {
  completed: 'completed',
  pending: 'pending',
  failed: 'failed',
  refunded: 'refunded',
}

export const normalizeGroupTransactions = (
  items: GroupApiTransaction[] = [],
): GroupTransactionSchema[] => {
  return items.map((item) => ({
    id: item.id,
    kind: typeMap[item.type] ?? 'payment',
    amount: item.amount,
    occurredAt: item.date,
    status: statusMap[item.status] ?? 'completed',
    description: item.description,
    category: item.category,
    details: {
      paidBy: item.paidBy,
      categoryLabel: item.category,
    },
  }))
}
