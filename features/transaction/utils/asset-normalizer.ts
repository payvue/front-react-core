import { AssetTransactionSchema, TransactionKind, TransactionStatus } from '../types'

interface AssetApiTransaction {
  id: string
  type: 'purchase' | 'use' | 'share' | 'receive'
  assetName: string
  amount: number
  date: string
  status: 'completed' | 'pending' | 'failed' | 'refunded'
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
    kind: typeMap[item.type] ?? 'asset_purchase',
    amount: item.amount,
    occurredAt: item.date,
    status: statusMap[item.status] ?? 'completed',
    description: item.assetName,
    category: item.category,
    details: {
      assetName: item.assetName,
      groupName: item.groupName,
      relatedUser: item.relatedUser,
      categoryLabel: item.category,
    },
  }))
}
