import { useCallback, useState } from 'react'
import { TransactionFilterState } from './transaction-filters'

const createDefaultFilters = (): TransactionFilterState => ({
  dateRange: { start: '', end: '' },
  transactionType: 'all',
  category: 'all',
  status: 'all',
  amountRange: { min: '', max: '' },
})

export const useTransactionAnalyticsFilters = () => {
  const [filters, setFilters] = useState<TransactionFilterState>(createDefaultFilters)

  const updateFilters = useCallback((next: TransactionFilterState) => {
    setFilters(next)
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(createDefaultFilters())
  }, [])

  return {
    filters,
    setFilters: updateFilters,
    resetFilters,
  }
}
