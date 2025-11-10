import { TransactionFiltersConfig } from '../components/transaction-container'
import { TransactionKind, TransactionStatus } from '../types'

export interface HistoryFiltersState {
  status: TransactionStatus | 'all'
  kind: TransactionKind | 'all'
}

export const historyFiltersConfig: TransactionFiltersConfig<HistoryFiltersState> = {
  initialState: {
    status: 'all',
    kind: 'all',
  },
}
