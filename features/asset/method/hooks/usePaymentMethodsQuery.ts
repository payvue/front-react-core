import { useQuery } from "@tanstack/react-query"
import type { Method } from "axios"
import request from "@/lib/api/client"
import APIResponse from "@/lib/api/types/response"
import { PaymentMethodModel, PaymentMethodResponse } from "../model/payment-method-type"

export const PAYMENT_METHOD_QUERY_KEY = ["paymentMethods"] as const
const PAYMENT_METHOD_ENDPOINT = "/asset/payment/methods"

const fetchPaymentMethods = async () => {
  const response = await request({
    method: "GET" as Method,
    url: PAYMENT_METHOD_ENDPOINT,
  }) as APIResponse<PaymentMethodResponse[]>

  const data = response.data ?? []

  return PaymentMethodModel.fromResponses(data)
}

export const usePaymentMethodsQuery = () => {
  const queryState = useQuery<PaymentMethodModel[]>({
    queryKey: PAYMENT_METHOD_QUERY_KEY,
    queryFn: fetchPaymentMethods,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })

  return {
    ...queryState,
    methods: queryState.data ?? [],
  }
}

export type UsePaymentMethodsQueryResult = ReturnType<typeof usePaymentMethodsQuery>
