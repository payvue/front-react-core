import { useMemo } from 'react'
import { usePaymentMethodsQuery } from './usePaymentMethodsQuery'

export const usePaymentMethodsState = () => {
  const queryState = usePaymentMethodsQuery()

  const activeMethods = useMemo(
    () => queryState.methods.filter((method) => method.isActive),
    [queryState.methods]
  )

  const defaultMethod = useMemo(
    () => activeMethods.find((method) => method.isDefault) ?? activeMethods[0] ?? null,
    [activeMethods]
  )

  return {
    ...queryState,
    activeMethods,
    defaultMethod,
  }
}

export type UsePaymentMethodsStateResult = ReturnType<typeof usePaymentMethodsState>
