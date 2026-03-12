'use client'

import { useQueryClient } from '@tanstack/react-query'
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import type { Pay } from '@/features/pay/types/pay'

import PayModal from '@/features/pay/payment/components/easy'
import type { Product } from '@/types'
import { purchase, select, done } from '@/features/pay/payment/store/slice'
import payvue from '@/lib/pay/client'
import { buildSummaryProduct } from '@/features/pay/utils/summary'
import useDisplayProduct from '@/features/pay/hooks/useDisplayProduct'
import { ASSET_SUMMARY_QUERY_KEY } from '@/features/asset/summary/hooks/useAssetSummaryQuery'
import { ONLINE_ASSET_QUERY_KEY } from '@/features/asset/summary/hooks/useOnlineAssetsQuery'
import useAsyncAccountQuery from '@/features/account/useAsyncAccountQuery'
import { useUserContext } from '@/components/context/user'
import {
  findVirtualAccountPending,
  listVirtualAccountPending,
  type VirtualAccountPendingData,
} from '@/features/pay/utils/virtual-account-pending'

interface PayContextType {
  open: (options: { product: Product | Product[]; mode?: Pay.Mode }) => void
  close: () => void
  hasPendingVirtualAccount: boolean
  pendingVirtualAccounts: VirtualAccountPendingData[]
  openPendingVirtualAccount: (payId?: string) => boolean
}

const PayContext = createContext<PayContextType | undefined>(undefined)
export const QUERY_PAY_KEY = ['payment']

const PayProvider = ({ children }: { children: ReactNode }) => {
  const [active, setActive] = useState(false)
  const [summaryProduct, setSummaryProduct] = useState<Product | null>(null)
  const [strategy, setStrategy] = useState<Pay.Mode>('single')
  const [pendingVirtualAccounts, setPendingVirtualAccounts] = useState<VirtualAccountPendingData[]>([])
  const [resumeVirtualAccount, setResumeVirtualAccount] = useState<VirtualAccountPendingData | null>(null)

  const state: Pay.Context = useAppSelector((current) => current.pay)
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useUserContext()
  const { fetch } = useAsyncAccountQuery(() => isAuthenticated, true)

  useEffect(() => {
    if (state) {
      const cachedData = queryClient.getQueryData<Pay.Context>(QUERY_PAY_KEY)
      if (JSON.stringify(cachedData) !== JSON.stringify(state)) {
        queryClient.setQueryData(QUERY_PAY_KEY, state)
      }
    }
  }, [state, queryClient])

  useEffect(() => {
    setPendingVirtualAccounts(listVirtualAccountPending())
  }, [active])

  const displayProduct = useDisplayProduct(summaryProduct, state.transactions.item)

  const openWithMode = (payload: Product | Product[], mode: Pay.Mode) => {
    setResumeVirtualAccount(null)
    setStrategy(mode)
    setSummaryProduct(buildSummaryProduct(payload))
    setActive(true)
    dispatch(purchase({ item: payload, mode }))
  }

  const open = ({
    product,
    mode = 'single',
  }: {
    product: Product | Product[]
    mode?: Pay.Mode
  }) => {
    openWithMode(product, mode)
  }

  const close = () => {
    dispatch(done())
    setResumeVirtualAccount(null)
    setActive(false)
    setSummaryProduct(null)
    setStrategy('single')
  }

  const openPendingVirtualAccount = useCallback((payId?: string) => {
    const pending = payId ? findVirtualAccountPending(payId) : listVirtualAccountPending()[0] ?? null
    if (!pending) {
      setPendingVirtualAccounts([])
      return false
    }

    if (active && resumeVirtualAccount?.issuedPayload.confirm?.payId === pending.issuedPayload.confirm?.payId) {
      return true
    }

    setPendingVirtualAccounts(listVirtualAccountPending())
    setResumeVirtualAccount(pending)
    setSummaryProduct(pending.product)
    setStrategy('single')
    setActive(true)
    dispatch(purchase({ item: pending.product, mode: 'single' }))
    return true
  }, [active, dispatch, resumeVirtualAccount?.issuedPayload.confirm?.payId])

  const process = async (method: Pay.Method): Promise<void> => {
    dispatch(select(method))

    const transaction: Pay.Common = {
      ...state.transactions,
      item: state.transactions.item,
      method,
      mode: state.transactions.mode ?? strategy,
    }

    await payvue({ strategy: state.transactions.mode ?? strategy }).payment(transaction)

    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ASSET_SUMMARY_QUERY_KEY }),
      queryClient.invalidateQueries({ queryKey: ONLINE_ASSET_QUERY_KEY }),
    ])

    await fetch()
  }

  const refreshAfterVirtualAccountConfirm = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ASSET_SUMMARY_QUERY_KEY }),
      queryClient.invalidateQueries({ queryKey: ONLINE_ASSET_QUERY_KEY }),
    ])

    await fetch()
  }

  return (
    <PayContext.Provider
      value={{
        open,
        close,
        hasPendingVirtualAccount: pendingVirtualAccounts.length > 0,
        pendingVirtualAccounts,
        openPendingVirtualAccount,
      }}
    >
      <PayModal
        isOpen={active}
        onClose={close}
        product={displayProduct}
        onPayment={async (method) => {
          await process(method)
        }}
        onVirtualAccountConfirmed={async () => {
          await refreshAfterVirtualAccountConfirm()
          setPendingVirtualAccounts(listVirtualAccountPending())
          setResumeVirtualAccount(null)
        }}
        resumeVirtualAccount={resumeVirtualAccount}
      />
      {children}
    </PayContext.Provider>
  )
}

export const usePayContext = () => {
  const context = useContext(PayContext)
  if (context === undefined) {
    throw new Error('usePayContext must be used within a PayProvider')
  }
  return context
}

export default PayProvider
export { PayContext }
