'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Loader, Zap, Clock, CreditCard } from 'lucide-react'
import payvue from '@/lib/pay/client'
import { responseCode } from '@/features/apis'

interface LoadingStyle {
  icon: React.ReactNode
  title: string
  description: string
  color: string
}

type ActionType = 'payment' | 'reservation' | 'cancel' | string

const getLoadingStyle = (action: ActionType): LoadingStyle => {
  const normalizedAction = action?.toLowerCase() as ActionType

  switch (normalizedAction) {
    case 'payment':
      return {
        icon: <CreditCard className="h-12 w-12" />,
        title: '결제 중입니다',
        description: '안전하게 결제를 진행하고 있습니다. 잠시만 기다려주세요.',
        color: 'from-blue-400 to-blue-600'
      }
    case 'reservation':
      return {
        icon: <Clock className="h-12 w-12" />,
        title: '예약 중입니다',
        description: '예약 정보를 처리하고 있습니다. 잠시만 기다려주세요.',
        color: 'from-amber-400 to-amber-600'
      }
    case 'cancel':
      return {
        icon: <Zap className="h-12 w-12" />,
        title: '결제 취소 중입니다',
        description: '결제 취소를 진행하고 있습니다. 잠시만 기다려주세요.',
        color: 'from-red-400 to-red-600'
      }
    default:
      return {
        icon: <Loader className="h-12 w-12" />,
        title: '처리 중입니다',
        description: '요청을 처리하고 있습니다. 잠시만 기다려주세요.',
        color: 'from-purple-400 to-purple-600'
      }
  }
}

type LoadingAnimationType = 'spinner' | 'pulse' | 'dots' | 'bars'

interface LoadingAnimationProps {
  type: LoadingAnimationType
  color: string
}

const LoadingAnimation = ({ type, color }: LoadingAnimationProps) => {
  const colorClasses = {
    'from-blue-400 to-blue-600': 'bg-blue-500',
    'from-amber-400 to-amber-600': 'bg-amber-500',
    'from-red-400 to-red-600': 'bg-red-500',
    'from-purple-400 to-purple-600': 'bg-purple-500'
  }
  
  const bgColor = colorClasses[color as keyof typeof colorClasses] || 'bg-purple-500'

  switch (type) {
    case 'spinner':
      return (
        <div className="flex justify-center">
          <div className={`w-12 h-12 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin`}></div>
        </div>
      )
    case 'pulse':
      return (
        <div className="flex justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${bgColor} animate-pulse`}
              style={{ animationDelay: `${i * 0.15}s` }}
            ></div>
          ))}
        </div>
      )
    case 'dots':
      return (
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${bgColor}`}
              style={{
                animation: `bounce 1.4s infinite`,
                animationDelay: `${i * 0.16}s`
              }}
            ></div>
          ))}
        </div>
      )
    case 'bars':
      return (
        <div className="flex justify-center items-end gap-1">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-1 ${bgColor}`}
              style={{
                height: `${12 + i * 4}px`,
                animation: `pulse 1s infinite`,
                animationDelay: `${i * 0.1}s`
              }}
            ></div>
          ))}
        </div>
      )
    default:
      return null
  }
}

const PaymentLoadingPage = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [animationType, setAnimationType] = useState<LoadingAnimationType>('spinner')

  const action = searchParams.get('action') || 'PAYMENT'
  const provider = searchParams.get('provider')
  const code = searchParams.get('code')
  const reserveId = searchParams.get('reserveId')

  const style = getLoadingStyle(action)

  useEffect(() => {

    const paymentApply = async () => {

      await new Promise((resolve) => setTimeout(resolve, 2000))

      if(code === responseCode.SUCCESS) {
          payvue().apply({
              provider: { id: provider! },
              paymentId: reserveId!
          }).then(({ code, message }) => {
              router.push(`/result?action=PAYMENT&code=${code}&message=${message}`)
          })
          .catch(error => {
              router.push(`/result?action=PAYMENT&code=FAILURE&message=결제 중 문제가 발생했습니다.`)    
          })
      }
      else {
        payvue().cancel({
          provider: { id: provider! },
          paymentId: reserveId!
        }).then(() => {
          router.push(`/result?action=PAYMENT&code=FAILURE&message=결제 중 문제가 발생했습니다.`)
        })
      }
    }

    paymentApply()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-purple-100">
      <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-12px);
          }
        }
      `}</style>
      
      <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-white bg-opacity-95">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-8">
            <div className={`p-4 rounded-full bg-gradient-to-br ${style.color} text-white`}>
              {style.icon}
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-purple-900 mb-3">
            {style.title}
          </CardTitle>
          <CardDescription className="text-base text-purple-600">
            {style.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="flex justify-center py-8">
            <LoadingAnimation type={animationType} color={style.color} />
          </div>


          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-xs text-blue-800">
              <span className="font-semibold">참고:</span> 추가적인 시간이 소요될 수 있습니다.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PaymentLoadingPage