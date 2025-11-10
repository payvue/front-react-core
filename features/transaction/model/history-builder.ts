import { formatCurrency } from '@/util/display'
import {
  HistoryTransactionDetails,
  HistoryTransactionSchema,
  TransactionModel,
  TransactionModelBuilder,
} from '../types'
import { formatDateTime } from '../utils/format'

export class HistoryTransactionModelBuilder
  implements TransactionModelBuilder<HistoryTransactionSchema>
{
  buildList(source: HistoryTransactionSchema[]): TransactionModel[] {
    if (!source) return []

    return source.map((item) => this.buildDetail(item))
  }

  buildDetail(item: HistoryTransactionSchema): TransactionModel {
    const details: HistoryTransactionDetails = item.details ?? {}

    return {
      id: item.id,
      title: item.description,
      subtitle: details.message ?? details.platform,
      amount: item.amount,
      status: item.status,
      occurredAt: item.occurredAt,
      metadata: {
        결제수단: details.paymentMethod ?? '미지정',
        플랫폼: details.platform ?? '미지정',
        위치: details.location ?? '미지정',
        수수료: details.transactionFee ? formatCurrency(details.transactionFee) : '-',
        거래일시: formatDateTime(item.occurredAt),
        메시지: details.message ?? '-',
      },
      category: item.category,
      kind: item.kind,
    }
  }
}

export const historyBuilder = new HistoryTransactionModelBuilder()
