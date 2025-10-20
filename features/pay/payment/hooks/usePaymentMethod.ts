import type { Pay } from '@/features/pay/types'
import type { SelectedMethod } from '@/features/pay/payment/model/SelectedMethod'
import { useCallback, useState } from 'react'
import type { Product } from '@/types'


const usePaymentMethod = (product: Product) => {

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

        return method.type === 'provider'
        ? { type: "easypay", details: { id: method.id } }
        : { type: "registered", details: { cardId: method.id } }
    }, [product]
)



    return {
        selected,
        selectMethod,
        getMethod
    }
}

export default usePaymentMethod