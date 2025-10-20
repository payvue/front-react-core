"use client"

import { useCallback, useMemo } from 'react'
import { total } from '@/util/bill'
import { providers } from '@/features/pay/types/providers'
import type { SelectedMethod } from '@/features/pay/payment/model/SelectedMethod'
import usePaymentMethod from './usePaymentMethod'
import usePaymentEventHandler from './usePaymentEventHandler'
import type { Pay } from '@/features/pay/types'
import type { Product } from '@/types'

type UsePaymentModalParams = {
  product: Product
  onClose: () => void
  onPayment: (method: Pay.Method) => Promise<void>
  setup: () => void
  teardown: () => void
}

type UsePaymentModalResult = {
  selected: SelectedMethod
  totalAmount: number
  selectedLabel: string
  formatCurrency: (value: number) => string
  handleDialogChange: (nextOpen: boolean) => void
  handleProviderSelect: (providerId: string) => void
  handleCardSelect: (cardId: string | null) => void
  handlePayment: () => Promise<void>
  handleClose: () => void
}

const currencyFormatter = new Intl.NumberFormat('ko-KR')

const formatCurrency = (value: number) => currencyFormatter.format(value)

const usePaymentModal = ({
  product,
  onClose,
  onPayment,
  setup,
  teardown
}: UsePaymentModalParams): UsePaymentModalResult => {
  const { selected, getMethod, selectMethod } = usePaymentMethod(product)

  const totalAmount = useMemo(() => total(product), [product])

  const selectedLabel = useMemo(() => {
    if (!selected) return '선택 안 됨'
    if (selected.type === 'provider') {
      const provider = providers.find(current => current.id === selected.id)
      return provider?.name ?? '선택 안 됨'
    }
    if (selected.type === 'card') return '등록된 카드'
    return '선택 안 됨'
  }, [selected])

  const handleClose = useCallback(() => {
    teardown()
    onClose()
    selectMethod(null)
  }, [onClose, selectMethod, teardown])

  usePaymentEventHandler({ onPaymentClosed: handleClose })

  const handleDialogChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) handleClose()
    },
    [handleClose]
  )

  const handleProviderSelect = useCallback(
    (providerId: string) => {
      selectMethod({ type: 'provider', id: providerId })
    },
    [selectMethod]
  )

  const handleCardSelect = useCallback(
    (cardId: string | null) => {
      if (!cardId) {
        selectMethod(null)
        return
      }

      selectMethod({ type: 'card', id: cardId })
    },
    [selectMethod]
  )

  const handlePayment = useCallback(async () => {
    if (!selected) return

    setup()

    try {
      await onPayment(getMethod(selected))
    } finally {
      teardown()
    }
  }, [selected, setup, onPayment, getMethod, teardown])

  return {
    selected,
    totalAmount,
    selectedLabel,
    formatCurrency,
    handleDialogChange,
    handleProviderSelect,
    handleCardSelect,
    handlePayment,
    handleClose
  }
}

export default usePaymentModal
