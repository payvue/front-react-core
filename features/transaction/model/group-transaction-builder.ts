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

    return {
      id: item.id,
      title: item.description,
      subtitle: `${details.paidBy} · ${new Date(item.occurredAt).toLocaleDateString('ko-KR')}`,
      amount: item.amount,
      status: item.status,
      occurredAt: item.occurredAt,
      metadata: {
        결제자: details.paidBy,
        카테고리: details.categoryLabel ?? item.category ?? '-',
      },
      category: details.categoryLabel ?? item.category,
      kind: item.kind,
    }
  }
}

export const groupTransactionBuilder = new GroupTransactionModelBuilder()
