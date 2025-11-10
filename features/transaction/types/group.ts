import { TransactionSchema, TransactionDetailsBase, TransactionKind, TransactionStatus } from '.'

export interface GroupTransactionDetails extends TransactionDetailsBase {
  paidBy: string
  categoryLabel?: string
}

export type GroupTransactionKind = TransactionKind | 'group_contribution' | 'group_withdrawal'

export type GroupTransactionSchema = TransactionSchema<GroupTransactionDetails> & {
  kind: GroupTransactionKind
  status: TransactionStatus
}
