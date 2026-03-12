'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import transferAPI, { TransferRequest } from './api'
const generateId = () => {
  if (
    typeof globalThis !== 'undefined' &&
    (globalThis as any).crypto &&
    typeof (globalThis as any).crypto.randomUUID === 'function'
  ) {
    return (globalThis as any).crypto.randomUUID()
  }
  return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export const useProfileSearch = (email: string) => {
  const enabled = !!email && email.length >= 2
  const query = useQuery({
    queryKey: ['profile', email],
    queryFn: () => transferAPI.getProfileByEmail(email),
    enabled,
    staleTime: 30000,
    select: (res: any) => res.data || null,
  })

  return query
}

export const useCreateTransfer = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (payload: TransferRequest) => {
      const body = { ...payload }
      if (!body.clientRequestId) body.clientRequestId = generateId()
      return transferAPI.createCashTransfer(body)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['transferHistory'])
      queryClient.invalidateQueries(['balance'])
    },
  })

  return mutation
}

export const useTransferHistory = (
  assetType?: string,
  txType?: string,
  params: Record<string, unknown> = {},
) => {
  const query = useQuery({
    queryKey: ['transferHistory', assetType, txType, params],
    queryFn: () => transferAPI.getTransferHistory(assetType, txType, params),
    select: (res: any) => res.data || { items: [], pagination: null },
  })

  return query
}
