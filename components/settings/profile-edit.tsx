import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Calendar, Edit2, Save, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"

type ProfileFormData = {
  email: string
  alias: string
}

type ProfileEditFormProps = {
  account: {
    id: string
    alias: string
    status: {
      joinAt: string
      isLoggedIn: boolean
    }
  }
  info: {
    contact: {
      email: string
    }
  }
  onSave: (data: ProfileFormData) => Promise<void>
  callback: () => void
}

export function ProfileEditForm({ account, info, onSave, callback }: ProfileEditFormProps) {
  const [isEditing, setIsEditing] = useState(false)

  const { control, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormData>({
    defaultValues: {
      email: info.contact.email,
      alias: account.alias,
    }
  })

  const handleSaveProfile = (data: ProfileFormData) => {
    onSave(data).then(() => {
      setIsEditing(false)
      callback()
    })
  }

  const handleCancelEdit = () => {
    reset({
      email: info.contact.email,
      alias: account.alias,
    })
    setIsEditing(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            프로필 정보
          </CardTitle>
          <CardDescription>회원 정보를 조회하고 수정할 수 있습니다</CardDescription>
        </div>
        {!isEditing && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit2 className="h-4 w-4 mr-2" />
            수정
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleSaveProfile)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="userId">사용자 ID</Label>
              <div className="flex items-center gap-2">
                <Input id="userId" value={account.id} disabled className="bg-muted" />
                <Badge variant="secondary">고유 ID</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nickname">닉네임</Label>
              {isEditing ? (
                <Controller
                  name="alias"
                  control={control}
                  rules={{ required: "닉네임은 필수입니다" }}
                  render={({ field }) => (
                    <div>
                      <Input
                        id="nickname"
                        {...field}
                      />
                      {errors.alias && (
                        <p className="text-sm text-red-500 mt-1">{errors.alias.message}</p>
                      )}
                    </div>
                  )}
                />
              ) : (
                <Input value={account.alias} disabled />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              {isEditing ? (
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "이메일은 필수입니다",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "올바른 이메일 형식이 아닙니다"
                    }
                  }}
                  render={({ field }) => (
                    <div>
                      <Input
                        id="email"
                        type="email"
                        {...field}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                      )}
                    </div>
                  )}
                />
              ) : (
                <Input value={info.contact.email} disabled />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="joinDate">가입일</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="joinDate"
                  value={new Date(account.status.joinAt).toLocaleDateString("ko-KR")}
                  disabled
                  className="bg-muted"
                />
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Label>계정 상태:</Label>
            <Badge variant="default" className={account.status.isLoggedIn ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
              {account.status.isLoggedIn ? '활성' : '비활성'}
            </Badge>
          </div>

          {isEditing && (
            <div className="flex gap-2 pt-4">
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                저장
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelEdit}
              >
                <X className="h-4 w-4 mr-2" />
                취소
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}