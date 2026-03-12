import { TransactionFiltersConfig } from '../components/transaction-container'
import { TransactionStatus } from '../types'

export interface AssetFiltersState {
  kind: 'asset_purchase' | 'asset_use' | 'share' | 'receive' | 'transfer' | 'all'
  status: TransactionStatus | 'all'
}

export const assetFiltersConfig: TransactionFiltersConfig<AssetFiltersState> = {
  initialState: {
    kind: 'all',
    status: 'all',
  },
}
