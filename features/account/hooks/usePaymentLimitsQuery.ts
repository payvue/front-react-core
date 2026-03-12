import { REQUEST_URL } from '@/constants'
import request from '@/lib/api/client'
import type APIResponse from '@/lib/api/types/response'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Method } from 'axios'

export interface PaymentLimitsData {
  dailyLimit: number
  monthlyLimit: number
  enableDailyLimit: boolean
  enableMonthlyLimit: boolean
  enableNotifications: boolean
  dailyUsed: number
  monthlyUsed: number
}

export interface PaymentLimitsUpdatePayload {
  dailyLimit: number
  monthlyLimit: number
  enableDailyLimit: boolean
  enableMonthlyLimit: boolean
  enableNotifications: boolean
}

export const PAYMENT_LIMITS_QUERY_KEY = ['paymentLimits'] as const

const defaultPaymentLimits: PaymentLimitsData = {
  dailyLimit: 0,
  monthlyLimit: 0,
  enableDailyLimit: true,
  enableMonthlyLimit: true,
  enableNotifications: true,
  dailyUsed: 0,
  monthlyUsed: 0,
}

export const usePaymentLimitsQuery = () => {
  return useQuery<PaymentLimitsData>({
    queryKey: PAYMENT_LIMITS_QUERY_KEY,
    queryFn: async () => {
      const response = (await request({
        method: 'GET' as Method,
        url: REQUEST_URL.PRIVATE.PAYMENT_LIMITS,
      })) as APIResponse<PaymentLimitsData>

      return response.data ?? defaultPaymentLimits
    },
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  })
}

export const useUpdatePaymentLimitsMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: PaymentLimitsUpdatePayload) => {
      return (await request({
        method: 'PUT' as Method,
        url: REQUEST_URL.PRIVATE.PAYMENT_LIMITS,
        data: payload,
      })) as APIResponse<null>
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_LIMITS_QUERY_KEY })
    },
  })
}

