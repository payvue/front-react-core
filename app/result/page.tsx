'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, Home } from 'lucide-react'
import { responseCode } from '@/features/apis'

interface CodeStyle {
  icon: React.ReactNode
  color: string
  title: string
  description: string
  isSuccess: boolean
}

const getCodeStyle = (
  action: string,
  code: responseCode | string
): CodeStyle => {
  const normalized = code?.toUpperCase() as responseCode

  switch (normalized) {
    case responseCode.SUCCESS:
      return {
        icon: <CheckCircle2 className="h-16 w-16 text-green-600" />,
        color: 'bg-green-100',
        title: `${action} 완료!`,
        description: '요청이 성공적으로 완료되었습니다.',
        isSuccess: true
      }
    default:
      return {
        icon: <XCircle className="h-16 w-16 text-red-600" />,
        color: 'bg-red-100',
        title: `${action} 실패`,
        description: '요청 시도 중 문제가 발생했습니다.',
        isSuccess: false
      }
  }
}

const ResultPage = () => {
  const searchParams = useSearchParams()
  const action = searchParams.get('action') || '사용자 요청'
  const codeParam = searchParams.get('code') || ''
  const message = searchParams.get('message') || '오류가 발생했습니다.'

  const style = getCodeStyle(action, codeParam)

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-purple-100">
      <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-white bg-opacity-90">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-6">
            <div className={`p-4 rounded-full ${style.color}`}>
              {style.icon}
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-purple-900 mb-2">
            {style.title}
          </CardTitle>
          <CardDescription className="text-base text-purple-600">
            {style.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div
            className={`${
              style.isSuccess ? 'bg-green-50' : 'bg-red-50'
            } rounded-lg p-4`}>
            <p
              className={`text-sm ${
                style.isSuccess ? 'text-green-900' : 'text-red-900'
              }`}>
              {decodeURIComponent(message)}
            </p>
          </div>

          <div className="space-y-3">
            {style.isSuccess ? (
              <Button
                onClick={() => (window.location.href = '/login')}
                className="w-full bg-purple-700 text-white hover:bg-purple-800 transition-colors">
                로그인 하기
              </Button>
            ) : (
              <Button
                onClick={() => window.history.back()}
                className="w-full bg-purple-700 text-white hover:bg-purple-800 transition-colors">
                다시 시도하기
              </Button>
            )}
            <Button
              onClick={() => (window.location.href = '/')}
              variant="outline"
              className="w-full border-purple-300 text-purple-700 hover:bg-purple-50 transition-colors">
              <Home className="mr-2 h-4 w-4" />
              홈으로 돌아가기
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ResultPage
