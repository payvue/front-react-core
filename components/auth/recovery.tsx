"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Mail, User, KeyRound } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import useRecoveryQuery from "@/features/account/useRecoveryQuery"

interface FindIdFormInputs {
  alias: string
  email: string
}

interface FindPasswordFormInputs {
  id: string
  email: string
}

type RecoveryProps = {
  convert: () => void
}

export function RecoveryForm({ convert }: RecoveryProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("password")


  const { findid, findpassword } = useRecoveryQuery()

  const { control: idControl, handleSubmit: handleIdSubmit, formState: { errors: idErrors } } = useForm<FindIdFormInputs>()
  const { control: passwordControl, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors } } = useForm<FindPasswordFormInputs>()

  const onSubmit = (callback: (data: any) => Promise<any>) => async (data: any) => {
    setIsLoading(true)
    callback(data).then(() => setIsLoading(false))
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <KeyRound className="h-8 w-8 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">계정 찾기</CardTitle>
        <CardDescription>아이디 또는 비밀번호를 찾으실 수 있습니다</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="id">아이디 찾기</TabsTrigger>
            <TabsTrigger value="password">비밀번호 찾기</TabsTrigger>
          </TabsList>

          <TabsContent value="id" className="mt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>이름</span>
                  </div>
                </Label>
                <Controller
                  name="alias"
                  control={idControl}
                  rules={{
                    required: "이름을 입력해주세요",
                  }}
                  render={({ field }) => (
                    <div>
                      <Input
                        {...field}
                        id="alias"
                        type="text"
                        placeholder="홍길동"
                        className={idErrors.alias ? "border-red-500" : ""}
                      />
                      {idErrors.alias && (
                        <p className="text-sm text-red-500 mt-1">{idErrors.alias.message}</p>
                      )}
                    </div>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="id-email">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>이메일</span>
                  </div>
                </Label>
                <Controller
                  name="email"
                  control={idControl}
                  rules={{
                    required: "이메일을 입력해주세요",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "올바른 이메일 형식이 아닙니다",
                    },
                  }}
                  render={({ field }) => (
                    <div>
                      <Input
                        {...field}
                        id="id-email"
                        type="email"
                        placeholder="example@email.com"
                        className={idErrors.email ? "border-red-500" : ""}
                      />
                      {idErrors.email && (
                        <p className="text-sm text-red-500 mt-1">{idErrors.email.message}</p>
                      )}
                    </div>
                  )}
                />
              </div>

              <Button 
                type="button" 
                className="w-full" 
                disabled={isLoading}
                onClick={handleIdSubmit(onSubmit(findid))}
              >
                {isLoading ? "처리 중..." : "아이디 찾기"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="password" className="mt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userid">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>아이디</span>
                  </div>
                </Label>
                <Controller
                  name="id"
                  control={passwordControl}
                  rules={{
                    required: "아이디를 입력해주세요",
                  }}
                  render={({ field }) => (
                    <div>
                      <Input
                        {...field}
                        id="userid"
                        type="text"
                        placeholder="아이디를 입력하세요"
                        className={passwordErrors.id ? "border-red-500" : ""}
                      />
                      {passwordErrors.id && (
                        <p className="text-sm text-red-500 mt-1">{passwordErrors.id.message}</p>
                      )}
                    </div>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password-email">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>이메일</span>
                  </div>
                </Label>
                <Controller
                  name="email"
                  control={passwordControl}
                  rules={{
                    required: "이메일을 입력해주세요",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "올바른 이메일 형식이 아닙니다",
                    },
                  }}
                  render={({ field }) => (
                    <div>
                      <Input
                        {...field}
                        id="password-email"
                        type="email"
                        placeholder="example@email.com"
                        className={passwordErrors.email ? "border-red-500" : ""}
                      />
                      {passwordErrors.email && (
                        <p className="text-sm text-red-500 mt-1">{passwordErrors.email.message}</p>
                      )}
                    </div>
                  )}
                />
              </div>

              <Button 
                type="button" 
                className="w-full" 
                disabled={isLoading}
                onClick={handlePasswordSubmit(onSubmit(findpassword))}
              >
                {isLoading ? "처리 중..." : "비밀번호 찾기"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center">
          <Button 
            variant="link" 
            className="text-sm"
            onClick={() => convert()}
          >
            로그인으로 돌아가기
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}