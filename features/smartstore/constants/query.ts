'use client'

export const SMART_STORE_QUERY_KEYS = {
  info: () => ['smartstore', 'info'] as const,
  members: (storeId?: string) => ['smartstore', 'members', storeId ?? 'all'] as const,
  inventory: (storeId?: string) => ['smartstore', 'inventory', storeId ?? 'all'] as const,
}

export const SMART_STORE_QUERY_STATUS_MAP = {
  pending: 'loading',
  success: 'success',
  error: 'error',
} as const
