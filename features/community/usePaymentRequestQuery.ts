import { useMutation, useQuery } from '@tanstack/react-query'
import useCommunityAPI from './api'
import { useRouter } from 'next/navigation'
import APPLICATION_ERROR_CODE from '@/constants/error'
import PATH from '@/constants/path'
import { responseCode } from '../apis'

interface PaymentRequest {
  id: string
  requesterId: string
  requesterName?: string
  requesterAvatar?: string
  groupId: string
  amount: number
  description: string
  category: string
  requestDate: string
  status: 'pending' | 'approved' | 'rejected'
  approvedDate?: string
  rejectedDate?: string
  rejectionReason?: string
  urgency: 'low' | 'medium' | 'high'
}

interface PaymentRequestCreate {
  amount: number
  description: string
  category: string
  urgency: 'low' | 'medium' | 'high'
}

interface PaymentRequestRaw {
  id: string
  requesterId: string
  requesterName?: string
  requesterAvatar?: string
  groupId: string
  amount: number
  description: string
  category: string
  requestDate?: string
  status?: string
  approvedDate?: string
  rejectedDate?: string
  rejectionReason?: string
  urgency?: 'low' | 'medium' | 'high'
}

const formatRequestDate = (value?: string) => {
  if (!value) {
    return ''
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

const normalizeStatus = (value?: string): PaymentRequest['status'] => {
  const normalized = value?.toLowerCase()
  if (normalized === 'approved') return 'approved'
  if (normalized === 'rejected') return 'rejected'
  return 'pending'
}

const normalizePaymentRequest = (item: PaymentRequestRaw): PaymentRequest => {
  return {
    id: item.id,
    requesterId: item.requesterId,
    requesterName: item.requesterName,
    requesterAvatar: item.requesterAvatar,
    groupId: item.groupId,
    amount: item.amount,
    description: item.description,
    category: item.category,
    requestDate: formatRequestDate(item.requestDate),
    status: normalizeStatus(item.status),
    approvedDate: formatRequestDate(item.approvedDate),
    rejectedDate: formatRequestDate(item.rejectedDate),
    rejectionReason: item.rejectionReason,
    urgency: item.urgency ?? 'medium',
  }
}

interface Request {
  Error: {
    code: string
    message: string
  }
}

const usePaymentRequestQuery = (groupId: string, isGroupLeader: boolean) => {
  const router = useRouter()
  const api = useCommunityAPI()

  // 결제 요청 조회 (그룹별, 그룹장 전용)
  const {
    data: groupRequests = [],
    isLoading: isLoadingGroupRequests,
    refetch: refetchGroupRequests,
  } = useQuery({
    queryKey: ['paymentRequests', groupId, 'cooperative'],
    queryFn: async () => {
      const response = await api.getPaymentRequests(groupId)
      return (response.data || []).map(normalizePaymentRequest)
    },
    enabled: isGroupLeader,
  })

  // 내 결제 요청 조회
  const {
    data: myRequests = [],
    isLoading: isLoadingMyRequests,
    refetch: refetchMyRequests,
  } = useQuery({
    queryKey: ['myPaymentRequests', groupId, 'cooperative'],
    queryFn: async () => {
      const response = await api.getMyPaymentRequests(groupId)
      return (response.data || []).map(normalizePaymentRequest)
    },
    enabled: !isGroupLeader,
  })

  const paymentRequests = isGroupLeader ? groupRequests : myRequests
  const isLoadingRequests = isGroupLeader ? isLoadingGroupRequests : isLoadingMyRequests
  const refetchRequests = isGroupLeader ? refetchGroupRequests : refetchMyRequests

  // 결제 요청 생성
  const { mutateAsync: createRequest } = useMutation({
    mutationFn: (data: PaymentRequestCreate) => api.createPaymentRequest(groupId, data),
    onSuccess: ({ code }) => {
      if (code === responseCode.SUCCESS) {
        if (isGroupLeader) {
          void refetchGroupRequests()
        } else {
          void refetchMyRequests()
        }
      }
    },
    onError: (error: Request.Error) => {
      if (
        error.code === APPLICATION_ERROR_CODE.NETWORK_ERROR ||
        error.code === APPLICATION_ERROR_CODE.INTERNAL_SERVER_ERROR
      ) {
        router.push(`${PATH.ERROR}?code=${error.code}`)
      }
    },
  })

  // 결제 요청 승인
  const { mutateAsync: approveRequest } = useMutation({
    mutationFn: (requestId: string) => api.approvePaymentRequest(requestId),
    onSuccess: ({ code }) => {
      if (code === responseCode.SUCCESS) {
        if (isGroupLeader) {
          void refetchGroupRequests()
        } else {
          void refetchMyRequests()
        }
      }
    },
    onError: (error: Request.Error) => {
      if (
        error.code === APPLICATION_ERROR_CODE.NETWORK_ERROR ||
        error.code === APPLICATION_ERROR_CODE.INTERNAL_SERVER_ERROR
      ) {
        router.push(`${PATH.ERROR}?code=${error.code}`)
      }
    },
  })

  // 결제 요청 거부
  const { mutateAsync: rejectRequest } = useMutation({
    mutationFn: ({ requestId, reason }: { requestId: string; reason: string }) =>
      api.rejectPaymentRequest(requestId, reason),
    onSuccess: ({ code }) => {
      if (code === responseCode.SUCCESS) {
        if (isGroupLeader) {
          void refetchGroupRequests()
        } else {
          void refetchMyRequests()
        }
      }
    },
    onError: (error: Request.Error) => {
      if (
        error.code === APPLICATION_ERROR_CODE.NETWORK_ERROR ||
        error.code === APPLICATION_ERROR_CODE.INTERNAL_SERVER_ERROR
      ) {
        router.push(`${PATH.ERROR}?code=${error.code}`)
      }
    },
  })

  return {
    paymentRequests,
    myRequests,
    isLoadingRequests,
    isLoadingMyRequests,
    createRequest,
    approveRequest,
    rejectRequest,
    refetchRequests,
  }
}

export default usePaymentRequestQuery
