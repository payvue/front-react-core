'use client'

import { TransactionContainer } from '../transaction-container'
import { useAssetTransactionsQuery } from '../../hooks/useAssetTransactionsQuery'
import { assetTransactionBuilder } from '../../model/asset-builder'
import { AssetTransactionsList } from './asset-transactions-list'
import { AssetFilters } from './asset-filters'
import { assetFiltersConfig } from '../../config/asset-filters'
import { AssetFiltersState } from '../../config/asset-filters'
import { TransactionModel } from '../../types'

const filterAssetTransactions = (item: TransactionModel, filters: AssetFiltersState) => {
  const kindMatched = filters.kind === 'all' || item.kind === filters.kind
  const statusMatched = filters.status === 'all' || item.status === filters.status
  return kindMatched && statusMatched
}

export function AssetTransactionsContainer() {
  const assetQuery = useAssetTransactionsQuery()

  return (
    <TransactionContainer
      queryResult={assetQuery}
      modelBuilder={assetTransactionBuilder}
      listComponent={AssetTransactionsList}
      filtersConfig={assetFiltersConfig}
      filterFn={filterAssetTransactions}
      renderFilters={(props) => <AssetFilters {...props} />}
      paginationConfig={{ pageSize: 10 }}
    />
  )
}
