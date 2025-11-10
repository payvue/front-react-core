// Transaction 도메인 공통 타입 정의
export type TransactionKind =
  | 'payment'
  | 'charge'
  | 'transfer'
  | 'asset_purchase'
  | 'asset_use'
  | 'share'
  | 'receive'

export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'refunded'

export type TransactionCategory =
  | 'online_asset'
  | 'shopping'
  | 'food'
  | 'transport'
  | 'entertainment'
  | 'gift'
  | 'etc'

export type TransactionDetailPrimitive = string | number | boolean | undefined

export interface TransactionDetailsBase {
  date?: string
  platform?: string
  location?: string
  time?: string
  message?: string
  [key: string]: TransactionDetailPrimitive
}

export type TransactionSchema<TDetails extends TransactionDetailsBase = TransactionDetailsBase> = {
  id: string
  kind: TransactionKind
  amount: number
  occurredAt: string
  status: TransactionStatus
  description: string
  category?: TransactionCategory
  details?: TDetails
}

export interface HistoryTransactionDetails extends TransactionDetailsBase {
  paymentMethod?: string
  transactionFee?: number
  merchantId?: string
}

export type HistoryTransactionSchema = TransactionSchema<HistoryTransactionDetails>

export interface AssetTransactionDetails extends TransactionDetailsBase {
  assetName: string
  groupName?: string
  relatedUser?: string
  categoryLabel?: string
}

export type AssetTransactionSchema = TransactionSchema<AssetTransactionDetails>

// UI 계층에서 사용하는 표준화된 모델
export interface TransactionModel {
  id: string
  title: string
  subtitle?: string
  amount: number
  status: TransactionStatus
  occurredAt: string
  metadata?: Record<string, string | number>
  category?: TransactionCategory
  kind: TransactionKind
}

export interface TransactionModelBuilder<
  TSchema extends
    TransactionSchema<TransactionDetailsBase> = TransactionSchema<TransactionDetailsBase>,
  TModel extends TransactionModel = TransactionModel,
> {
  buildList(source: TSchema[]): TModel[]
  buildDetail(item: TSchema): TModel
}
