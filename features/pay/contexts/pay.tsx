"use client"

import { useQueryClient } from "@tanstack/react-query"
import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import type { Pay } from "@/features/pay/types/pay"

import PayModal from "@/features/pay/payment/components/easy"
import type { Product } from "@/types"
import { purchase, select, done } from "@/features/pay/payment/store/slice"
import payvue from "@/lib/pay/client"
import { buildSummaryProduct } from "@/features/pay/utils/summary"
import useDisplayProduct from "@/features/pay/hooks/useDisplayProduct"

interface PayContextType {
  open: (options: { product: Product | Product[]; mode?: Pay.Mode }) => void
  close: () => void
}

const PayContext = createContext<PayContextType | undefined>(undefined)
export const QUERY_PAY_KEY = ["payment"]

const PayProvider = ({ children }: { children: ReactNode }) => {
  const [active, setActive] = useState(false)
  const [summaryProduct, setSummaryProduct] = useState<Product | null>(null)
  const [strategy, setStrategy] = useState<Pay.Mode>("single")

  const state: Pay.Context = useAppSelector((current) => current.pay)
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (state) {
      const cachedData = queryClient.getQueryData<Pay.Context>(QUERY_PAY_KEY)
      if (JSON.stringify(cachedData) !== JSON.stringify(state)) {
        queryClient.setQueryData(QUERY_PAY_KEY, state)
      }
    }
  }, [state, queryClient])

  const displayProduct = useDisplayProduct(summaryProduct, state.transactions.item)

  const openWithMode = (payload: Product | Product[], mode: Pay.Mode) => {
    setStrategy(mode)
    setSummaryProduct(buildSummaryProduct(payload))
    setActive(true)
    dispatch(purchase({ item: payload, mode }))
  }

  const open = ({ product, mode = "single" }: { product: Product | Product[]; mode?: Pay.Mode }) => {
    openWithMode(product, mode)
  }

  const close = () => {
    dispatch(done())
    setActive(false)
    setSummaryProduct(null)
    setStrategy("single")
  }

  const process = async (method: Pay.Method): Promise<void> => {
    dispatch(select(method))

    const transaction: Pay.Common = {
      ...state.transactions,
      item: state.transactions.item,
      method,
      mode: state.transactions.mode ?? strategy,
    }

    await payvue({ strategy: state.transactions.mode ?? strategy }).payment(transaction)
  }

  return (
    <PayContext.Provider
      value={{
        open,
        close,
      }}
    >
      <PayModal
        isOpen={active}
        onClose={close}
        product={displayProduct}
        onPayment={async (method) => {
          await process(method)
        }}
      />
      {children}
    </PayContext.Provider>
  )
}

export const usePayContext = () => {
  const context = useContext(PayContext)
  if (context === undefined) {
    throw new Error("usePayContext must be used within a PayProvider")
  }
  return context
}

export default PayProvider
export { PayContext }
