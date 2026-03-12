import type { Pay } from '@/features/pay/types'
import type { SelectedMethod } from '@/features/pay/payment/model/SelectedMethod'
import { useCallback, useState } from 'react'
import type { Product } from '@/types'

type PaymentMethodOptions = {
  tossChannel: 'easypay' | 'virtual_account'
  bankCode: Pay.BankCode | ''
}

const usePaymentMethod = (product: Product, options: PaymentMethodOptions) => {

    const [selected, setSelected] = useState<SelectedMethod>(null)

    const selectMethod = useCallback(
        (method: SelectedMethod) => {
            setSelected(prev =>
            !method
                ? null
                : prev?.type === method.type && prev.id === method.id
                ? null
                : method
            )
        }, [product]
    )

    const getMethod = useCallback(
    (method?: SelectedMethod): Pay.Method => {
        if (!method) throw new Error("결제 수단이 선택되지 않았습니다.")

        if (method.type === 'provider') {
          if (method.id === 'toss' && options.tossChannel === 'virtual_account') {
            if (!options.bankCode) {
              throw new Error('가상계좌 은행을 선택해주세요')
            }

            return {
              type: 'bank',
              details: {
                id: method.id,
                channel: 'virtual_account',
                bankCode: options.bankCode
              } as Pay.VirtualAccountDetails
            }
          }

          return { type: 'easypay', details: { id: method.id } }
        }

        return { type: "registered", details: { cardId: method.id } }
    }, [product, options]
)



    return {
        selected,
        selectMethod,
        getMethod
    }
}

export default usePaymentMethod
