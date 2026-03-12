import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit2, Save, X } from "lucide-react"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"

type PasswordFormData = {
    origin: string
    changed: string
    confirmChanged: string
}

type PasswordChangeFormProps = {
  onSave: (data: PasswordFormData) => Promise<void>
  callback: () => void
}

export function PasswordChangeForm({ onSave, callback }: PasswordChangeFormProps) {

  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const {control, handleSubmit, reset, watch, formState: { errors }} = useForm<PasswordFormData>({
    defaultValues: {
      origin: "",
      changed: "",
      confirmChanged: "",
    }
  })

  const handlePasswordSubmit = async (data: PasswordFormData) => {
    try {
      await onSave(data)
      reset()
      setIsChangingPassword(false)
      alert('비밀번호가 정상적으로 변경되었습니다.')
      const confirmed = window.confirm('다시 로그인하시겠습니까?')
      if (confirmed) {
        callback()
      }
    } catch (error) {
      alert('비밀번호 변경에 실패했습니다.')
    }
  }

  const handleCancelPasswordChange = () => {
    reset()
    setIsChangingPassword(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit2 className="h-5 w-5" />
          비밀번호 변경
        </CardTitle>
        <CardDescription>계정 보안을 위해 정기적으로 비밀번호를 변경하세요</CardDescription>
      </CardHeader>
      <CardContent>
        {!isChangingPassword ? (
          <Button onClick={() => setIsChangingPassword(true)}>비밀번호 변경하기</Button>
        ) : (
          <form onSubmit={handleSubmit(handlePasswordSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="origin">현재 비밀번호</Label>
              <Controller
                name="origin"
                control={control}
                rules={{ required: "현재 비밀번호를 입력하세요" }}
                render={({ field }) => (
                  <div>
                    <Input
                      id="origin"
                      type="password"
                      {...field}
                    />
                    {errors.origin && (
                      <p className="text-sm text-red-500 mt-1">{errors.origin.message}</p>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">새 비밀번호</Label>
              <Controller
                name="changed"
                control={control}
                rules={{
                  required: "새 비밀번호를 입력하세요",
                  minLength: {
                    value: 8,
                    message: "비밀번호는 최소 8자 이상이어야 합니다"
                  }
                }}
                render={({ field }) => (
                  <div>
                    <Input
                      id="newPassword"
                      type="password"
                      {...field}
                    />
                    {errors.changed && (
                      <p className="text-sm text-red-500 mt-1">{errors.changed.message}</p>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
              <Controller
                name="confirmChanged"
                control={control}
                rules={{
                  required: "비밀번호 확인을 입력하세요",
                  validate: (value) => 
                    value === watch("confirmChanged") || "비밀번호가 일치하지 않습니다"
                }}
                render={({ field }) => (
                  <div>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...field}
                    />
                    {errors.confirmChanged && (
                      <p className="text-sm text-red-500 mt-1">{errors.confirmChanged.message}</p>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                변경하기
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelPasswordChange}
              >
                <X className="h-4 w-4 mr-2" />
                취소
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
