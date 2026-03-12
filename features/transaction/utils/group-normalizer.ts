import { GroupTransactionSchema, GroupTransactionKind } from '../types/group'
import { TransactionStatus } from '../types'

interface GroupApiTransaction {
  id: string
  type?: 'payment' | 'contribution' | 'withdrawal'
  kind?: string
  amount?: number | null
  description?: string
  paidBy?: string | null
  sender?: string | null
  triggerName?: string | null
  date?: string
  occurredAt?: string
  status?: 'completed' | 'pending' | 'failed' | 'refunded'
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
    kind:
      item.type
        ? typeMap[item.type] ?? 'payment'
        : item.kind === 'transfer'
          ? 'transfer'
          : item.kind === 'payment'
            ? 'payment'
            : 'payment',
    amount: item.amount ?? 0,
    occurredAt: item.date ?? item.occurredAt ?? new Date().toISOString(),
    status: item.status ? statusMap[item.status] ?? 'completed' : 'completed',
    description: item.description ?? '-',
    category: item.category,
    details: {
      paidBy: item.paidBy ?? item.sender ?? item.triggerName ?? undefined,
      categoryLabel: item.category,
    },
  }))
}
