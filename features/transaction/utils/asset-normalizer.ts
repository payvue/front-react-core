import { AssetTransactionSchema, TransactionKind, TransactionStatus } from '../types'

interface AssetApiTransaction {
  id: string
  kind?: 'purchase' | 'use' | 'share' | 'receive' | 'transfer' | 'acquire'
  type?: 'purchase' | 'use' | 'share' | 'receive'
  assetName?: string
  description?: string
  amount?: number | null
  date?: string
  occurredAt?: string
  status?: 'completed' | 'pending' | 'failed' | 'refunded'
  category?: string
  relatedUser?: string
  groupName?: string
}

const typeMap: Record<AssetApiTransaction['type'], TransactionKind> = {
  purchase: 'asset_purchase',
  use: 'asset_use',
  share: 'share',
  receive: 'receive',
}

const statusMap: Record<AssetApiTransaction['status'], TransactionStatus> = {
  completed: 'completed',
  pending: 'pending',
  failed: 'failed',
  refunded: 'refunded',
}

export const normalizeAssetTransactions = (
  items: AssetApiTransaction[] = [],
): AssetTransactionSchema[] => {
  return items.map((item) => ({
    id: item.id,
    kind: item.type ? typeMap[item.type] : item.kind === 'transfer' ? 'transfer' : 'asset_purchase',
    amount: item.amount ?? 0,
    occurredAt: item.date ?? item.occurredAt ?? new Date().toISOString(),
    status: item.status ? statusMap[item.status] : 'completed',
    description: item.assetName ?? item.description ?? '',
    category: item.category,
    details: {
      assetName: item.assetName ?? item.description ?? '',
      groupName: item.groupName,
      relatedUser: item.relatedUser,
      categoryLabel: item.category,
    },
  }))
}
