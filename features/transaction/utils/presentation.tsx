import { TransactionCategory, TransactionKind, TransactionStatus } from '../types'
import { GroupTransactionKind } from '../types/group'
import {
  ArrowDownLeft,
  ArrowUpRight,
  Bike,
  CreditCard,
  Gift,
  ShoppingBag,
  Smartphone,
  Ticket,
  Coffee,
  Share,
} from 'lucide-react'
import type { ReactElement } from 'react'

interface BadgeDisplay {
  label: string
  className: string
}

interface KindMeta {
  label: string
  icon: ReactElement
}

const statusDisplayMap: Record<TransactionStatus, BadgeDisplay> = {
  completed: { label: '완료', className: 'bg-green-100 text-green-800' },
  pending: { label: '대기', className: 'bg-yellow-100 text-yellow-800' },
  failed: { label: '실패', className: 'bg-red-100 text-red-800' },
  refunded: { label: '환불', className: 'bg-blue-100 text-blue-800' },
}

const defaultStatusDisplay: BadgeDisplay = {
  label: '알수없음',
  className: 'bg-muted text-muted-foreground',
}

export const getStatusDisplay = (status: TransactionStatus | string): BadgeDisplay => {
  const key = status as TransactionStatus
  return statusDisplayMap[key] ?? defaultStatusDisplay
}

const categoryLabelMap: Record<TransactionCategory, string> = {
  online_asset: '온라인 자산',
  shopping: '쇼핑',
  food: '식음료',
  transport: '교통',
  entertainment: '엔터테인먼트',
  etc: '기타',
}

const categoryIconMap: Record<TransactionCategory, ReactElement> = {
  online_asset: <Smartphone className="h-4 w-4 text-blue-500" />,
  shopping: <ShoppingBag className="h-4 w-4 text-amber-500" />,
  food: <Coffee className="h-4 w-4 text-emerald-500" />,
  transport: <Bike className="h-4 w-4 text-purple-500" />,
  entertainment: <Ticket className="h-4 w-4 text-pink-500" />,
  etc: <Gift className="h-4 w-4 text-orange-500" />,
}

const normalizeCategoryKey = (category?: string): TransactionCategory => {
  if (!category) return 'etc'
  const normalized = category.replace(/[\s/]/g, '').toLowerCase()
  switch (normalized) {
    case '온라인자산':
    case 'onlineasset':
      return 'online_asset'
    case '쇼핑':
    case 'shopping':
      return 'shopping'
    case '식음료':
    case 'food':
      return 'food'
    case '교통':
    case 'transport':
      return 'transport'
    case '엔터테인먼트':
    case 'entertainment':
      return 'entertainment'
    default:
      return 'etc'
  }
}

export const getCategoryLabel = (category?: string) => {
  const key = normalizeCategoryKey(category)
  return categoryLabelMap[key] ?? category ?? '기타'
}

export const getCategoryIcon = (category?: string): ReactElement => {
  const key = normalizeCategoryKey(category)
  return categoryIconMap[key] ?? categoryIconMap.etc
}

export const getGroupCategoryIcon = getCategoryIcon

const kindMetaMap: Record<string, KindMeta> = {
  payment: { label: '결제', icon: <ShoppingBag className="h-4 w-4" /> },
  charge: { label: '충전', icon: <ArrowDownLeft className="h-4 w-4 text-green-600" /> },
  transfer: { label: '송금', icon: <ArrowUpRight className="h-4 w-4 text-blue-600" /> },
  asset_purchase: { label: '자산 구매', icon: <ArrowDownLeft className="h-4 w-4 text-blue-500" /> },
  asset_use: { label: '자산 사용', icon: <ArrowUpRight className="h-4 w-4 text-red-500" /> },
  share: { label: '공유', icon: <Share className="h-4 w-4 text-green-500" /> },
  receive: { label: '수신', icon: <ArrowDownLeft className="h-4 w-4 text-purple-500" /> },
  group_contribution: {
    label: '그룹 충전',
    icon: <ArrowDownLeft className="h-4 w-4 text-emerald-500" />,
  },
  group_withdrawal: {
    label: '그룹 인출',
    icon: <ArrowUpRight className="h-4 w-4 text-indigo-500" />,
  },
}

const defaultKindMeta: KindMeta = {
  label: '거래',
  icon: <CreditCard className="h-4 w-4 text-muted-foreground" />,
}

export const getKindMeta = (kind?: TransactionKind | GroupTransactionKind | string): KindMeta => {
  if (!kind) return defaultKindMeta
  return kindMetaMap[kind] ?? defaultKindMeta
}
