export interface DistributionStat {
  count: number
  amount: number
}

export interface TransactionStats<TKey extends string = string> {
  totalIncome: number
  totalExpense: number
  netAmount: number
  transactionCount: number
  categoryStats: Record<TKey, DistributionStat>
  typeStats: Record<TKey, DistributionStat>
}

export interface TransactionStatsInput<TKey extends string = string> {
  amount: number
  category?: TKey
  kind: TKey
}

export const buildTransactionStats = <TKey extends string = string>(
  records: TransactionStatsInput<TKey>[],
): TransactionStats<TKey> => {
  let totalIncome = 0
  let totalExpense = 0
  const categoryStats: Record<TKey, DistributionStat> = {} as Record<TKey, DistributionStat>
  const typeStats: Record<TKey, DistributionStat> = {} as Record<TKey, DistributionStat>

  records.forEach((record) => {
    if (record.amount > 0) {
      totalIncome += record.amount
    } else {
      totalExpense += Math.abs(record.amount)
    }

    if (record.category) {
      const categoryKey = record.category
      if (!categoryStats[categoryKey]) {
        categoryStats[categoryKey] = { count: 0, amount: 0 }
      }
      categoryStats[categoryKey].count += 1
      categoryStats[categoryKey].amount += Math.abs(record.amount)
    }

    const typeKey = record.kind
    if (!typeStats[typeKey]) {
      typeStats[typeKey] = { count: 0, amount: 0 }
    }
    typeStats[typeKey].count += 1
    typeStats[typeKey].amount += Math.abs(record.amount)
  })

  return {
    totalIncome,
    totalExpense,
    netAmount: totalIncome - totalExpense,
    transactionCount: records.length,
    categoryStats,
    typeStats,
  }
}
