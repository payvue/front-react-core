import { GroupTransactionDetails, GroupTransactionSchema } from '../types/group'
import { TransactionModel, TransactionModelBuilder } from '../types'

export class GroupTransactionModelBuilder
  implements TransactionModelBuilder<GroupTransactionSchema>
{
  buildList(source: GroupTransactionSchema[]): TransactionModel[] {
    if (!source) return []

    return source.map((item) => this.buildDetail(item))
  }

  buildDetail(item: GroupTransactionSchema): TransactionModel {
    const details: GroupTransactionDetails = item.details ?? { paidBy: '' }
    const occurredAt = this.resolveOccurredAt(item.occurredAt)
    const displayDate = new Date(occurredAt).toLocaleDateString('ko-KR')
    const paidBy = details.paidBy?.trim()
    const showPaidBy = Boolean(paidBy) && item.kind !== 'acquire'

    return {
      id: item.id,
      title: item.description || '-',
      subtitle: showPaidBy ? `${paidBy} · ${displayDate}` : displayDate,
      amount: item.amount,
      status: item.status,
      occurredAt,
      metadata: {
        결제자: showPaidBy ? paidBy : '-',
        카테고리: details.categoryLabel ?? item.category ?? '-',
      },
      category: details.categoryLabel ?? item.category,
      kind: item.kind,
    }
  }

  private resolveOccurredAt(value?: string) {
    if (!value) return new Date().toISOString()
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return new Date().toISOString()
    return value
  }
}

export const groupTransactionBuilder = new GroupTransactionModelBuilder()
