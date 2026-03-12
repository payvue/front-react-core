import { SESSION_STORAGE_KEY } from '@/constants'
import type { PaymentInitiateData } from '@/lib/pay/strategy'
import type { Product } from '@/types'

export interface VirtualAccountPendingData {
  issuedPayload: PaymentInitiateData
  product: Product
  createdAt: string
  paymentKind?: 'virtual_account' | 'easypay' | 'registered'
  paymentMode?: 'single' | 'multiple' | 'recurrent'
}

const MAX_PENDING_HOURS = 24

const isExpired = (createdAt: string) => {
  const created = new Date(createdAt).getTime()
  if (Number.isNaN(created)) {
    return true
  }

  return Date.now() - created > MAX_PENDING_HOURS * 60 * 60 * 1000
}

const isValidPending = (item: VirtualAccountPendingData) => {
  const payId = item?.issuedPayload?.confirm?.payId
  return Boolean(item?.issuedPayload && item?.product && item?.createdAt && payId && !isExpired(item.createdAt))
}

const readRaw = (): VirtualAccountPendingData[] => {
  if (typeof window === 'undefined') {
    return []
  }

  const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY.PAYMENT_VIRTUAL_ACCOUNT_PENDING)
  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw) as VirtualAccountPendingData | VirtualAccountPendingData[]
    const list = Array.isArray(parsed) ? parsed : [parsed]
    return list.filter(isValidPending)
  } catch {
    return []
  }
}

const writeRaw = (payload: VirtualAccountPendingData[]) => {
  if (typeof window === 'undefined') {
    return
  }

  if (payload.length === 0) {
    window.sessionStorage.removeItem(SESSION_STORAGE_KEY.PAYMENT_VIRTUAL_ACCOUNT_PENDING)
    return
  }

  window.sessionStorage.setItem(SESSION_STORAGE_KEY.PAYMENT_VIRTUAL_ACCOUNT_PENDING, JSON.stringify(payload))
}

export const listVirtualAccountPending = (): VirtualAccountPendingData[] => {
  const list = readRaw()
  writeRaw(list)
  return list
}

export const appendVirtualAccountPending = (payload: VirtualAccountPendingData) => {
  const payId = payload?.issuedPayload?.confirm?.payId
  if (!payId) {
    return
  }

  const list = listVirtualAccountPending()
  const next = [...list.filter((item) => item.issuedPayload.confirm?.payId !== payId), payload]
  writeRaw(next)
}

export const removeVirtualAccountPending = (payId?: string) => {
  if (!payId) {
    return
  }

  const list = listVirtualAccountPending()
  writeRaw(list.filter((item) => item.issuedPayload.confirm?.payId !== payId))
}

export const clearVirtualAccountPending = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.removeItem(SESSION_STORAGE_KEY.PAYMENT_VIRTUAL_ACCOUNT_PENDING)
}

export const readVirtualAccountPending = (): VirtualAccountPendingData | null => {
  return listVirtualAccountPending()[0] ?? null
}

export const findVirtualAccountPending = (payId?: string): VirtualAccountPendingData | null => {
  if (!payId) {
    return null
  }

  return listVirtualAccountPending().find((item) => item.issuedPayload.confirm?.payId === payId) ?? null
}

export const hasVirtualAccountPending = () => listVirtualAccountPending().length > 0
