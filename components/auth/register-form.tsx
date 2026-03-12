"use client"

import React, { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, UserPlus } from "lucide-react"
import { cityOptions, districtMap } from "@/constants"
import { phoneFormater } from "@/util/display"
import { RegisterRequest } from "@/features/apis/requests"
import useAccountQuery from "@/features/account/useAccountQuery"
import { useRouter } from "next/navigation"
import APIResponse from "@/lib/api/types/response"

interface RegisterFormValues {
  alias: string
  id: string
  password: string
  confirmPassword: string
  name: string
  resident: string
  birth: string
  email: string
  phone: string
  address: {
    city: string
    district: string
    street: string
    postCode: string
    detailed: string
  }
}

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [maskedResident, setMaskedResident] = useState("")

  const {handleSubmit, control, watch, formState: { errors }} = useForm<RegisterFormValues>({mode: "onSubmit"})
  const selectedCity = watch("address.city")

  const { signup } = useAccountQuery()

  const onSubmit = async (data: RegisterFormValues) => {
      setIsLoading(true)
      const [birthYear, birthMonth, birthDay] = data.birth
        .split("-")
        .map((value) => Number(value))

      const payload: RegisterRequest = {
        alias: data.alias,
        username: data.id,
        name: data.name,
        residentRegistrationNo: data.resident,
        birthYear: birthYear || 0,
        birthMonth: birthMonth || 0,
        birthDay: birthDay || 0,
        email: data.email,
        phone: data.phone,
        password: data.password,
        passwordConfirm: data.confirmPassword,
        sido: data.address.city,
        sigungu: data.address.district,
        roadAddress: data.address.street,
        postalCode: data.address.postCode,
        detailAddress: data.address.detailed,
      }

      signup(payload).then(() => {
        setIsLoading(false)  
      }).catch((error: Error) => {
        setIsLoading(false)
        alert(error.message || "이미 등록된 사용자입니다. 다른 정보로 다시 시도해주세요.")
      })
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl border-0 bg-white bg-opacity-90">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-purple-100">
            <UserPlus className="h-8 w-8 text-purple-700" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-purple-900">회원가입</CardTitle>
        <CardDescription className="text-purple-600">정보를 입력해 주세요</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="alias">별명 (alias)</Label>
              <Controller
                name="alias"
                control={control}
                rules={{ required: "별명을 입력해 주세요" }}
                render={({ field }) => <Input id="alias" {...field} />}
              />
              {errors.alias && (
                <p className="text-red-500 text-xs mt-1">{errors.alias.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="id">아이디</Label>
              <Controller
                name="id"
                control={control}
                rules={{ required: "아이디를 입력해 주세요" }}
                render={({ field }) => <Input id="id" {...field} />}
              />
              {errors.id && (
                <p className="text-red-500 text-xs mt-1">{errors.id.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="name">이름</Label>
              <Controller
                name="name"
                control={control}
                rules={{ required: "이름을 입력해 주세요" }}
                render={({ field }) => <Input id="name" {...field} />}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="resident">주민등록번호</Label>
              <Controller
                name="resident"
                control={control}
                rules={{ required: "주민등록번호를 입력해 주세요" }}
                render={({ field }) => (
                  <Input
                    id="resident"
                    type="text"
                    value={maskedResident}
                    onChange={(e) => {
                      const inputEvent = e.nativeEvent as InputEvent;
                      const resident = (watch("resident") ?? "") + inputEvent.data

                      const masked =
                        resident.length <= 6
                          ? resident
                          : `${resident.slice(0, 6)}-${"●".repeat(resident.length - 6)}`

                      setMaskedResident(masked)
                      field.onChange(resident)
                    }}
                    placeholder="123456-●●●●●●●"
                    maxLength={13}
                    inputMode="numeric"
                  />
                )}
              />

              {errors.resident && (
                <p className="text-red-500 text-xs mt-1">{errors.resident.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="birth">생년월일</Label>
              <Controller
                name="birth"
                control={control}
                rules={{ required: "생년월일을 입력해 주세요" }}
                render={({ field }) => <Input id="birth" type="date" {...field} />}
              />
              {errors.birth && (
                <p className="text-red-500 text-xs mt-1">{errors.birth.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="email">이메일</Label>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "이메일을 입력해 주세요",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "올바른 이메일 형식이 아닙니다",
                  },
                }}
                render={({ field }) => <Input id="email" type="email" {...field} />}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="phone">전화번호</Label>
              <Controller
                name="phone"
                control={control}
                rules={{ required: "전화번호를 입력해 주세요" }}
                render={({ field }) => (
                  <Input
                    id="phone"
                    type="text"
                    value={field.value}
                    onChange={(e) => {
                      const formatted = phoneFormater(e.target.value)
                      field.onChange(formatted)
                    }}
                    placeholder="010-1234-5678"
                  />
                )}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <div className="relative">
              <Controller
                name="password"
                control={control}
                rules={{
                  required: "비밀번호를 입력해 주세요",
                  minLength: {
                    value: 8,
                    message: "비밀번호는 최소 8자 이상이어야 합니다",
                  },
                }}
                render={({ field }) => (
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...field}
                  />
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-purple-700" />
                ) : (
                  <Eye className="h-4 w-4 text-purple-700" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">비밀번호 확인</Label>
            <div className="relative">
              <Controller
                name="confirmPassword"
                control={control}
                rules={{ required: "비밀번호 확인을 입력해 주세요" }}
                render={({ field }) => (
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    {...field}
                  />
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-purple-700" />
                ) : (
                  <Eye className="h-4 w-4 text-purple-700" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">시/도</Label>
              <Controller
                name="address.city"
                control={control}
                rules={{ required: "시/도를 선택해 주세요" }}
                render={({ field }) => (
                  <select
                    id="city"
                    {...field}
                    className="
                      block w-full 
                      rounded-md 
                      border border-gray-300 
                      bg-white 
                      px-3 py-2 
                      text-sm text-gray-700 
                      shadow-sm 
                      placeholder:text-gray-400 
                      focus:border-purple-500 
                      focus:ring-1 focus:ring-purple-500 
                      transition-all duration-150 ease-in-out
                    "
                  >
                    <option value="">선택하세요</option>
                    {cityOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.address?.city && (
                <p className="text-red-500 text-xs mt-1">{errors.address.city.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="district">구/군</Label>
              <Controller
                name="address.district"
                control={control}
                rules={{ required: "구/군을 선택해 주세요" }}
                render={({ field }) => (
                  <select
                    id="district"
                    {...field}
                    disabled={!selectedCity}
                    className="
                      block w-full 
                      rounded-md 
                      border border-gray-300 
                      bg-white 
                      px-3 py-2 
                      text-sm text-gray-700 
                      shadow-sm 
                      placeholder:text-gray-400 
                      focus:border-purple-500 
                      focus:ring-1 focus:ring-purple-500 
                      transition-all duration-150 ease-in-out
                      disabled:bg-gray-100 disabled:cursor-not-allowed
                    "
                  >
                    <option value="">선택하세요</option>
                    {selectedCity &&
                      (districtMap[selectedCity] ?? []).map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                  </select>
                )}
              />
              {errors.address?.district && (
                <p className="text-red-500 text-xs mt-1">{errors.address.district.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="street">도로명 주소</Label>
              <Controller
                name="address.street"
                control={control}
                rules={{ required: "도로명 주소를 입력해 주세요" }}
                render={({ field }) => <Input id="street" {...field} />}
              />
              {errors.address?.street && (
                <p className="text-red-500 text-xs mt-1">{errors.address.street.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="postCode">우편번호</Label>
              <Controller
                name="address.postCode"
                control={control}
                rules={{ required: "우편번호를 입력해 주세요" }}
                render={({ field }) => <Input id="postCode" {...field} />}
              />
              {errors.address?.postCode && (
                <p className="text-red-500 text-xs mt-1">{errors.address.postCode.message}</p>
              )}
            </div>
            <div className="col-span-2">
              <Label htmlFor="detailed">상세 주소</Label>
              <Controller
                name="address.detailed"
                control={control}
                rules={{ required: "상세 주소를 입력해 주세요" }}
                render={({ field }) => <Input id="detailed" {...field} />}
              />
              {errors.address?.detailed && (
                <p className="text-red-500 text-xs mt-1">{errors.address.detailed.message}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-purple-700 text-white hover:opacity-90"
            disabled={isLoading}
          >
            {isLoading ? "가입 중..." : "회원가입"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
