'use client'

import { OAuthLogin } from './oauth-login'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff, Shield } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import useAuthQuery from '@/features/auth/useAuthQuery'
import { useRouter } from 'next/navigation'
import { OAuthProvider } from '@/features/auth/types/oauth'

interface LoginFormInputs {
  email: string
  password: string
}

type LoginProps = {
  convert: () => void
}

export function LoginForm({ convert }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>()
  const { login } = useAuthQuery()

  const router = useRouter()

  const handleOAuthLogin = (provider: OAuthProvider) => {
    console.log(`OAuth login with ${provider}`)
  }

  const onSubmit = async (data: LoginFormInputs): Promise<void> => {
    setIsLoading(true)
    setLoginError(null)
    login(data)
      .then(() => {
        setIsLoading(false)
        router.push('/dashboard')
      })
      .catch(() => {
        setIsLoading(false)
        setLoginError('로그인에 실패했습니다.')
      })
  }

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader className='text-center'>
        <div className='flex justify-center mb-4'>
          <div className='p-3 bg-primary/10 rounded-full'>
            <Shield className='h-8 w-8 text-primary' />
          </div>
        </div>
        <CardTitle className='text-2xl font-bold'>로그인</CardTitle>
        <CardDescription>안전한 간편결제 플랫폼에 로그인하세요</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='email'>이메일</Label>
            <Controller
              name='email'
              control={control}
              rules={{
                required: '이메일을 입력해주세요',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: '올바른 이메일 형식이 아닙니다',
                },
              }}
              render={({ field }) => (
                <div>
                  <Input
                    {...field}
                    id='email'
                    type='email'
                    placeholder='example@email.com'
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className='text-sm text-red-500 mt-1'>{errors.email.message}</p>
                  )}
                </div>
              )}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='password'>비밀번호</Label>
            <div className='relative'>
              <Controller
                name='password'
                control={control}
                rules={{
                  required: '비밀번호를 입력해주세요',
                  minLength: {
                    value: 6,
                    message: '비밀번호는 최소 6자 이상이어야 합니다',
                  },
                }}
                render={({ field }) => (
                  <div>
                    <div className='relative'>
                      <Input
                        {...field}
                        id='password'
                        type={showPassword ? 'text' : 'password'}
                        placeholder='비밀번호를 입력하세요'
                        className={errors.password ? 'border-red-500' : ''}
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                      </Button>
                    </div>
                    {errors.password && (
                      <p className='text-sm text-red-500 mt-1'>{errors.password.message}</p>
                    )}
                  </div>
                )}
              />
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
              </Button>
            </div>
          </div>
          <Button type='submit' className='w-full' disabled={isLoading}>
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>
        </form>

        <div className='mt-6'>
          <OAuthLogin onOAuthLogin={handleOAuthLogin} />
        </div>

        {loginError && <p className='mt-4 text-sm text-red-500'>{loginError}</p>}

        <div className='mt-4 text-center'>
          <Button variant='link' className='text-sm' onClick={() => convert()}>
            비밀번호를 잊으셨나요?
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
