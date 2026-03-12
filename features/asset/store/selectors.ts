import type { RootState } from '@/lib/store/store'

const CATEGORY_KEYS = ['game', 'music', 'gift', 'shopping', 'cash', 'mileage'] as const

const createEmptyBreakdown = () => {
  return CATEGORY_KEYS.reduce<Record<string, number>>((acc, category) => {
    acc[category] = 0
    return acc
  }, {})
}

const toMonthKey = (dateValue: string) => {
  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return `${date.getFullYear()}-${date.getMonth() + 1}`
}

export const selectAssetItems = (state: RootState) => state.asset.items

export const selectAssetOverview = (state: RootState) => {
  const items = selectAssetItems(state)
  const categoryBreakdown = createEmptyBreakdown()

  let totalValue = 0
  const now = new Date()
  const currentMonthKey = `${now.getFullYear()}-${now.getMonth() + 1}`
  const previousDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const previousMonthKey = `${previousDate.getFullYear()}-${previousDate.getMonth() + 1}`
  let currentMonthTotal = 0
  let previousMonthTotal = 0

  items.forEach((item) => {
    const amount = Number(item.amount ?? item.balance ?? 0)
    if (Number.isNaN(amount)) {
      return
    }

    totalValue += amount

    const normalizedCategory = (item.category ?? 'gift').toLowerCase()
    if (!(normalizedCategory in categoryBreakdown)) {
      categoryBreakdown[normalizedCategory] = 0
    }
    categoryBreakdown[normalizedCategory] += amount

    const monthKey = toMonthKey(item.purchaseDate)
    if (monthKey === currentMonthKey) {
      currentMonthTotal += amount
    }
    if (monthKey === previousMonthKey) {
      previousMonthTotal += amount
    }
  })

  return {
    totalValue,
    personalAssets: totalValue,
    sharedAssets: 0,
    monthlyChange: currentMonthTotal - previousMonthTotal,
    categoryBreakdown,
  }
}
