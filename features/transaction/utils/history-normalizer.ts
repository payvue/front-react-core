import { HistoryTransactionDetails, HistoryTransactionSchema, TransactionSchema } from '../types'

interface LegacyHistoryTransaction extends Partial<TransactionSchema<HistoryTransactionDetails>> {
  type?: HistoryTransactionSchema['kind']
  date?: string
  platform?: string
  location?: string
  time?: string
  merchantId?: string
  transactionFee?: number
  paymentMethod?: string
  message?: string
  occurred_at?: string
}

const ensureOccurredAt = (item: LegacyHistoryTransaction, details: HistoryTransactionDetails) => {
  if (item.occurredAt) return item.occurredAt
  if (item.occurred_at) return item.occurred_at
  if (details.date) {
    const parsedDate = new Date(details.date)
    if (!Number.isNaN(parsedDate.valueOf())) {
      return parsedDate.toISOString()
    }
  }
  return new Date().toISOString()
}

export const normalizeHistoryTransaction = (
  item: LegacyHistoryTransaction,
): HistoryTransactionSchema => {
  const details: HistoryTransactionDetails = {
    ...(item.details ?? {}),
    date: item.details?.date ?? item.date,
    platform: item.details?.platform ?? item.platform,
    location: item.details?.location ?? item.location,
    time: item.details?.time ?? item.time,
    merchantId: item.details?.merchantId ?? item.merchantId,
    transactionFee: item.details?.transactionFee ?? item.transactionFee,
    paymentMethod: item.details?.paymentMethod ?? item.paymentMethod,
    message: item.details?.message ?? item.message,
  }

  return {
    id: item.id ?? `history-${Math.random().toString(36).slice(2)}`,
    kind: item.kind ?? item.type ?? 'payment',
    amount: item.amount ?? 0,
    occurredAt: ensureOccurredAt(item, details),
    status: item.status ?? 'completed',
    description: item.description ?? '',
    category: item.category,
    details,
  }
}

export const normalizeHistoryTransactions = (
  items: LegacyHistoryTransaction[] = [],
): HistoryTransactionSchema[] => items.map(normalizeHistoryTransaction)
