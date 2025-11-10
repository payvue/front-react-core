import { HistoryTransactionSchema } from '../types'
import { TransactionStatsInput } from '@/shared/utils/statistics'

export const mapHistoryToStatsInput = (
  transactions: HistoryTransactionSchema[] = [],
): TransactionStatsInput[] =>
  transactions.map((transaction) => ({
    amount: transaction.amount,
    category: (transaction.category ?? '기타') as string,
    kind: transaction.kind,
  }))
